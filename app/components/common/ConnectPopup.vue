<template>
  <div
    v-if="isOpen"
    class="popup"
    role="dialog"
    aria-modal="true"
    aria-label="Let's talk"
  >
    <button ref="closeRef" class="close" type="button" @click="close">
      <span class="p2">Close</span>
      <IconPlus class="close-icon" />
    </button>

    <div
      ref="formContainerRef"
      class="pane form-pane"
      data-lenis-prevent
      :inert="thanksShown"
    >
      <div class="form-inner">
        <h2 class="title h3">Let's talk about the impact you'd like to make.</h2>
        <PageConnectForm @success="playThanks" />
      </div>
    </div>

    <div
      v-if="thanksShown"
      ref="thanksContainerRef"
      class="pane thanks-pane"
      data-lenis-prevent
    >
      <p class="thanks-text">
        Thank you. We've received your message and will get back to you shortly.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transitionDurations } from "~/utils/gsap-autoimport"

const route = useRoute()
const { isOpen, open, close } = useConnectPopup()

onMounted(() => {
  if (route.query.form !== undefined) open()
})

watch(() => route.query.form, (value) => {
  if (value !== undefined) {
    if (!isOpen.value) open()
    return
  }

  if (isOpen.value) close()
})

const closeRef = ref<HTMLButtonElement | null>(null)
const formContainerRef = ref<HTMLElement | null>(null)
const thanksContainerRef = ref<HTMLElement | null>(null)
const thanksShown = ref(false)
let thanksTween: gsap.core.Timeline | null = null

const resetThanks = () => {
  thanksTween?.kill()
  thanksTween = null
  thanksShown.value = false
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") close()
}

const playThanks = async () => {
  if (thanksTween) return

  thanksShown.value = true
  await nextTick()

  const form = formContainerRef.value
  const thanks = thanksContainerRef.value
  if (!form || !thanks) return

  const duration = transitionDurations.durM

  thanksTween = gsap.timeline()
  thanksTween
    .fromTo(form, { yPercent: 0 }, { yPercent: -100, duration, ease: "custom.in" })
    .fromTo(thanks, { yPercent: 100 }, { yPercent: 0, duration, ease: "custom.out" }, 0.2)
}

watch(isOpen, async (open) => {
  if (!import.meta.client) return

  if (!open) {
    window.removeEventListener("keydown", onKeydown)
    resetThanks()
    return
  }

  window.addEventListener("keydown", onKeydown)
  await nextTick()
  closeRef.value?.focus()
})

onUnmounted(() => {
  thanksTween?.kill()
  if (import.meta.client) window.removeEventListener("keydown", onKeydown)
  if (isOpen.value) useLockScroll(false)
})
</script>

<style scoped lang="scss">
.popup {
  position: fixed;
  z-index: 2000;
  inset: 0;
  background: var(--c-white);
  color: var(--c-black);
  overflow: hidden;
}

.close {
  position: absolute;
  z-index: 3;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--c-black);

  @include mobile {
    top: 1rem;
    right: 1rem;
  }
}

.close-icon {
  transform: rotate(45deg);
}

.pane {
  position: absolute;
  inset: 0;
  display: flex;
  overflow-y: auto;
}

.form-pane {
  padding: 5rem 1.5rem 2.5rem;

  @include mobile {
    padding: 4.5rem 1rem 2rem;
  }
}

.form-inner {
  width: 52rem;
  max-width: 100%;
  margin: auto;
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.descr {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1rem;
  line-height: 130%;
}

.thanks-pane {
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.thanks-text {
  width: 22rem;
  max-width: 100%;
  text-align: center;
  font-size: 1.5rem;
  line-height: 130%;
}
</style>
