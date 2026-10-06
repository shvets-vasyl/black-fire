<template>
  <main class="main-page">
    <PageMainHero />
    <PageMainBranding />
    <PageMainBrands />
    <PageMainWork />

    <div data-header-black class="sect-white">
      <PageMainServices />
      <PageMainTestimonials />
    </div>

    <PageMainAbout />
    <PageMainBigPhoto />
    <PageMainContact />
  </main>
</template>

<script setup lang="ts">
import type Lenis from "lenis"
import { animateTextDefault, animateTitleDefault } from "~/utils/animations"
import { transitionDurations } from "~/utils/gsap-autoimport"

const route = useRoute()
const lenis = useState<Lenis | null>("lenis")
const { scrollToSection } = useScrollToSection()
const headerIntroPlayed = useState("header-intro-played", () => false)

const revealFirstScreen = () => {
  const header = document.querySelector<HTMLElement>("[data-header]")

  if (header && !headerIntroPlayed.value) {
    headerIntroPlayed.value = true
    gsap.fromTo(
      header,
      { yPercent: -100 },
      {
        yPercent: 0,
        duration: transitionDurations.durL,
        ease: "custom.out",
      }
    )
  }

  document.querySelectorAll<HTMLElement>("[data-intro-title]").forEach((title) => {
    animateTitleDefault(title, { type: "enter" })
  })

  document.querySelectorAll<HTMLElement>("[data-intro-text]").forEach((text) => {
    animateTextDefault(text, { type: "enter" })
  })
}

useAfterTransition(() => {
  useCommonAnimations()
  revealFirstScreen()

  const id = route.hash.slice(1)
  if (!id) return

  lenis.value?.resize()
  scrollToSection(id)
})
</script>

<style scoped lang="scss">
.main-page {
  background: var(--c-black);
}
</style>
