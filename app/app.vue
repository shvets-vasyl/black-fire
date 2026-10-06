<template>
  <div class="wrapper">
    <CommonPreloader />
    <CommonHeader />
    <NuxtPage />
    <CommonConnectPopup />
  </div>
</template>

<script setup lang="ts">
useState("transition-done", () => true)
</script>

<style scoped lang="scss"></style>
