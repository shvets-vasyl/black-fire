<template>
  <div
    v-if="shown"
    class="preloader"
    :class="{ 'is-hiding': hiding }"
    @transitionend="onTransitionEnd"
  />
</template>

<script setup lang="ts">
import type Lenis from "lenis"

const HOLD = 1000
const FADE = 800

const preloaderDone = useState("preloader-done", () => false)
const lenis = useState<Lenis | null>("lenis")

const shown = ref(true)
const hiding = ref(false)

let hideTimer = 0
let removeTimer = 0

const finish = () => {
  if (preloaderDone.value) return
  hiding.value = true
  preloaderDone.value = true
  const popupOpen =
    useState<boolean>("connect-popup-open").value ||
    useState<boolean>("project-popup-open").value
  if (!popupOpen) lenis.value?.start()
  removeTimer = window.setTimeout(() => {
    shown.value = false
  }, FADE + 50)
}

const onTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName !== "opacity") return
  window.clearTimeout(removeTimer)
  shown.value = false
}

onMounted(() => {
  lenis.value?.stop()
  hideTimer = window.setTimeout(finish, HOLD)
})

onBeforeUnmount(() => {
  window.clearTimeout(hideTimer)
  window.clearTimeout(removeTimer)
  lenis.value?.start()
})
</script>

<style scoped lang="scss">
.preloader {
  position: fixed;
  z-index: 10000;
  inset: 0;
  background: var(--c-black);
  transition: opacity var(--dur-m) var(--custom-ease-out);

  &.is-hiding {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
