interface Options {
  amount?: number
  start?: string
  end?: string
}

const DEFAULT_AMOUNT = 10

const getMedia = (wrap: HTMLElement) =>
  wrap.querySelector<HTMLElement>("[data-anim-parallax-media]") ||
  wrap.querySelector<HTMLElement>("img, video") ||
  (wrap.firstElementChild as HTMLElement | null)

const readPositive = (raw: string | null) => {
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const getAmount = (wrap: HTMLElement, amount?: number) => {
  if (amount !== undefined) return amount
  return readPositive(wrap.getAttribute("data-anim-parallax")) ?? DEFAULT_AMOUNT
}

export const animateParallaxDefault = (wrap: HTMLElement, options: Options = {}) => {
  const media = getMedia(wrap)
  if (!media) return null

  const amount = getAmount(wrap, options.amount)

  return gsap.fromTo(
    media,
    {
      yPercent: -amount,
    },
    {
      yPercent: amount,
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
