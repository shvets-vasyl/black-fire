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
  padding-left: 1rem;
}
.subtitle:after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 0.5rem;
  height: 0.5rem;
  background-color: currentColor;
}
</style>
