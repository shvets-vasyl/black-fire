<template>
  <div class="error-page">
    <h1 class="h1">404</h1>

    <CommonButtonTemplate href="/" text="Go back home" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--c-black);
  color: var(--c-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
</style>
