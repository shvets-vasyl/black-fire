import {
  animateFadeDefault,
  animateParallaxDefault,
  animateTextDefault,
  animateTitleDefault,
} from "~/utils/animations"

const isViewportHidden = (el: Element) =>
  !!el.closest(".is-mobile-hidden") || el.closest("[inert]") != null

let headerThemeTriggers: ScrollTrigger[] = []

export function useCommonAnimations() {
  if (!import.meta.client) return

  initAnimTitles()
  initAnimTexts()
  initAnimFades()
  initAnimParallax()
  initHeaderTheme()
}

const initAnimTitles = () => {
  const titles = document.querySelectorAll("[data-anim-title]")

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
  const texts = document.querySelectorAll("[data-anim-text]")

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

const initHeaderTheme = () => {
  const header = document.querySelector<HTMLElement>("[data-header]")
  if (!header) return

  headerThemeTriggers.forEach((trigger) => trigger.kill())
  headerThemeTriggers = []

  const isBlack = useState("header-is-black", () => false)
  const active = new Set<HTMLElement>()

  const apply = () => {
    isBlack.value = active.size > 0
  }

  document.querySelectorAll<HTMLElement>("[data-header-black]").forEach((section) => {
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: () => `top ${header.offsetHeight}px`,
      end: () => `bottom ${header.offsetHeight}px`,
      onToggle: (self) => {
        if (self.isActive) active.add(section)
        else active.delete(section)
        apply()
      },
    })

    if (trigger.isActive) active.add(section)
    headerThemeTriggers.push(trigger)
  })

  apply()
}
