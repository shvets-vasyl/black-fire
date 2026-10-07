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

const route = useRoute()
const lenis = useState<Lenis | null>("lenis")
const { scrollToSection } = useScrollToSection()

useAfterTransition(() => {
  useCommonAnimations()

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
