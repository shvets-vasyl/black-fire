<template>
  <main class="work-page">
    <PageWorkHero />
    <PageMainContact hide-subtitle />
  </main>
</template>

<script setup lang="ts">
useAfterTransition(useCommonAnimations)
</script>

<style scoped lang="scss">
.work-page {
  background: var(--c-black);
}
</style>
