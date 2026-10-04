import {
  animateFadeDefault,
  animateParallaxDefault,
  animateTextDefault,
  animateTitleDefault,
} from "~/utils/animations"

let fitTextsCleanup: (() => void) | null = null

const isViewportHidden = (el: Element) =>
  !!el.closest(".is-mobile-hidden") || el.closest("[inert]") != null

export function useCommonAnimations() {
  if (!import.meta.client) return

  initFitTexts()
  initAnimTitles()
  initAnimTexts()
  initAnimFades()
  initAnimParallax()
}

const fitTexts = () => {
  document.querySelectorAll<HTMLElement>("[data-fit-text]").forEach((el) => {
    fitText(el)
  })
}

const initFitTexts = () => {
  fitTextsCleanup?.()

  fitTexts()

  window.addEventListener("resize", fitTexts)

  fitTextsCleanup = () => {
    window.removeEventListener("resize", fitTexts)
  }
}

const initAnimTitles = () => {
  const titles = document.querySelectorAll<SplittedHtmlElement>("[data-anim-title]")

  titles.forEach((title) => {
    if (isViewportHidden(title)) return

    const animation = animateTitleDefault(title, { type: "enter", delay: 0 })
    animation.pause(0)

    ScrollTrigger.create({
      trigger: title,
      start: "top 90%",
      once: true,
      onEnter: () => animation.play(),
    })
  })
}

const initAnimTexts = () => {
  const texts = document.querySelectorAll<SplittedHtmlElement>("[data-anim-text]")

  texts.forEach((text) => {
    if (isViewportHidden(text)) return

    const animation = animateTextDefault(text, { type: "enter", delay: 0 })
    animation.pause(0)

    ScrollTrigger.create({
      trigger: text,
      start: "top 90%",
      once: true,
      onEnter: () => animation.play(),
    })
  })
}

const initAnimFades = () => {
  const fades = document.querySelectorAll<HTMLElement>("[data-anim-fade]")

  fades.forEach((fade) => {
    if (isViewportHidden(fade)) return

    const animation = animateFadeDefault(fade, { type: "enter", delay: 0 })
    animation.pause(0)

    ScrollTrigger.create({
      trigger: fade,
      start: "top 90%",
      once: true,
      onEnter: () => animation.play(),
    })
  })
}

const initAnimParallax = () => {
  const wraps = document.querySelectorAll<HTMLElement>("[data-anim-parallax]")

  wraps.forEach((wrap) => {
    if (isViewportHidden(wrap)) return
    animateParallaxDefault(wrap)
  })
}
