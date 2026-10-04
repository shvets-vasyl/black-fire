<template>
  <main class="main-page">
    <CommonHeader />

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
import { animateTextDefault, animateTitleDefault } from "~/utils/animations"
import { transitionDurations } from "~/utils/gsap-autoimport"

const revealFirstScreen = () => {
  const header = document.querySelector<HTMLElement>("[data-header]")

  if (header) {
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
})
</script>

<style scoped lang="scss"></style>
