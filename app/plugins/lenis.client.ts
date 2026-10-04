import Lenis from "lenis"

export default defineNuxtPlugin(() => {
  const lenis = useState("lenis", () => {
    return new Lenis({
      lerp: 0.07,
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: true,
    })
  })
  lenis.value.on("scroll", () => ScrollTrigger.update())
  gsap.ticker.add((time) => {
    lenis.value.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  lenis.value.stop()
})
