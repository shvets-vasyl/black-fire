<template>
  <div class="subtitle p2">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped lang="scss">
.subtitle {
  position: relative;
  padding-left: 0.625rem;
}
.subtitle:after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 0.375rem;
  height: 0.375rem;
  background-color: currentColor;
}
</style>
