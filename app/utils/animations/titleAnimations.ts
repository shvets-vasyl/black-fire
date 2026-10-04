import { SplitText } from "gsap/all"

interface Options {
  type: AnimationType
  duration?: keyof typeof transitionDurations
  ease?: string
  delay?: number
  words?: boolean
}

const STAGGER = 0.1
const ROTATION = 4

export const animateTitleDefault = (element: SplittedHtmlElement, options: Options) => {
  const { type, duration, ease, delay, words } = options

  if (!element._split) {
    element._split = new SplitText(element, {
      type: words ? "lines,words" : "lines",
      tag: "span",
      linesClass: "split-line",
      ...(words ? { wordsClass: "split-word" } : {}),
      mask: "lines",
      aria: "none",
    })
  }

  gsap.set(element, {
    autoAlpha: 1,
  })

  const { lines } = element._split

  gsap.set(lines, {
    transformOrigin: "left bottom",
  })

  if (type === "enter") {
    return gsap.fromTo(
      lines,
      {
        yPercent: 110,
        rotation: ROTATION,
      },
      {
        yPercent: 0,
        rotation: 0,
        duration: duration ? transitionDurations[duration] : transitionDurations.durL,
        ease: ease ? ease : "custom.out",
        stagger: STAGGER,
        overwrite: true,
        delay: delay !== undefined ? delay : transitionDurations.durDelayReveal,
        onStart: () => {
          gsap.set(element, {
            pointerEvents: "auto",
            userSelect: "unset",
          })
        },
      }
    )
  }

  return gsap.to(lines, {
    yPercent: -110,
    rotation: -ROTATION,
    duration: duration ? transitionDurations[duration] : transitionDurations.durS,
    ease: ease ? ease : "custom.in",
    stagger: STAGGER * 0.5,
    delay: delay !== undefined ? delay : 0,
    overwrite: true,
    onStart: () => {
      gsap.set(element, {
        pointerEvents: "none",
        userSelect: "none",
      })
    },
  })
}
