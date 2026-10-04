import { SplitText } from "gsap/all"

interface Options {
  type: AnimationType
  duration?: keyof typeof transitionDurations
  ease?: string
  delay?: number
}

const STAGGER = 0.1
const OFFSET_Y = 100

export const animateTextDefault = (element: SplittedHtmlElement, options: Options) => {
  const { type, duration, ease, delay } = options

  if (!element._split) {
    element._split = new SplitText(element, {
      type: "lines",
      tag: "span",
      linesClass: "split-line",
      aria: "none",
    })
  }

  gsap.set(element, {
    autoAlpha: 1,
  })

  const { lines } = element._split

  if (type === "enter") {
    return gsap.fromTo(
      lines,
      {
        yPercent: OFFSET_Y,
        autoAlpha: 0,
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: duration ? transitionDurations[duration] : transitionDurations.durL,
        delay: delay !== undefined ? delay : transitionDurations.durDelayReveal,
        stagger: STAGGER,
        ease: ease ? ease : "custom.out",
        overwrite: true,
        onStart: () => {
          gsap.set(element, {
            pointerEvents: "auto",
            userSelect: "unset",
            zIndex: 100,
          })
        },
      }
    )
  }

  return gsap.to(lines, {
    yPercent: -OFFSET_Y,
    autoAlpha: 0,
    duration: duration ? transitionDurations[duration] : transitionDurations.durS,
    ease: ease ? ease : "custom.in",
    stagger: STAGGER * 0.5,
    delay: delay !== undefined ? delay : 0,
    overwrite: true,
    onStart: () => {
      gsap.set(element, {
        pointerEvents: "none",
        userSelect: "none",
        zIndex: "unset",
      })
    },
  })
}
