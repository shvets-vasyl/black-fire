interface Options {
  type: AnimationType
  duration?: keyof typeof transitionDurations
  ease?: string
  delay?: number
}

const OFFSET_Y = "1.5rem"

export const animateFadeDefault = (element: HTMLElement, options: Options) => {
  const { type, duration, ease, delay } = options

  if (type === "enter") {
    return gsap.fromTo(
      element,
      {
        autoAlpha: 0,
        y: OFFSET_Y,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: duration ? transitionDurations[duration] : transitionDurations.durL,
        ease: ease ? ease : "custom.out",
        delay: delay !== undefined ? delay : transitionDurations.durDelayReveal,
        overwrite: true,
      }
    )
  }

  return gsap.to(element, {
    autoAlpha: 0,
    y: OFFSET_Y,
    duration: duration ? transitionDurations[duration] : transitionDurations.durS,
    ease: ease ? ease : "custom.in",
    delay: delay !== undefined ? delay : 0,
    overwrite: true,
  })
}
