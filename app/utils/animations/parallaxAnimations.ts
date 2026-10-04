interface Options {
  amount?: number
  scale?: number
  start?: string
  end?: string
}

const DEFAULT_AMOUNT = 10
const DEFAULT_SCALE = 1.3

const getMedia = (wrap: HTMLElement) =>
  wrap.querySelector<HTMLElement>("[data-anim-parallax-media]") ||
  wrap.querySelector<HTMLElement>("img, video") ||
  (wrap.firstElementChild as HTMLElement | null)

const getAmount = (wrap: HTMLElement, amount?: number) => {
  if (amount !== undefined) return amount

  const raw = wrap.getAttribute("data-anim-parallax")
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_AMOUNT
}

export const animateParallaxDefault = (wrap: HTMLElement, options: Options = {}) => {
  const media = getMedia(wrap)
  if (!media) return null

  const amount = getAmount(wrap, options.amount)
  const scale = options.scale ?? DEFAULT_SCALE

  return gsap.fromTo(
    media,
    {
      yPercent: -amount,
      scale,
    },
    {
      yPercent: amount,
      scale,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        scrub: true,
        start: options.start ?? "top bottom",
        end: options.end ?? "bottom top",
      },
    }
  )
}
