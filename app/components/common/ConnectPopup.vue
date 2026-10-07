<template>
  <div v-if="shown" class="popup" role="dialog" aria-modal="true" aria-label="Let's talk">
    <div ref="blurRef" class="popup-blur" @click="close" />

    <div ref="containerRef" class="popup-container">
      <button ref="closeRef" class="close" type="button" @click="close">
        <IconClose />
      </button>

      <div
        ref="formContainerRef"
        class="pane form-pane"
        data-lenis-prevent
        :inert="thanksShown"
      >
        <h2 class="title h3">
          Let's talk about <br />the impact you'd like <br />to make.
        </h2>
        <PageConnectForm @success="playThanks" />
      </div>

      <div
        v-if="thanksShown"
        ref="thanksContainerRef"
        class="pane thanks-pane"
        data-lenis-prevent
      >
        <IconLogo />
        <h3 class="thanks-text h3">
          WE'VE GOT YOUR <br />REQUEST AND WILL REACH <br />you OUT SOON.
        </h3>
        <CommonButtonTemplate text="go to homepage" grey @click="goHome" />

        <p class="close-timer p2" aria-live="polite">
          This window will close in {{ closeIn }}…
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transitionDurations } from "~/utils/gsap-autoimport"

const CLOSE_IN_SECONDS = 7

const route = useRoute()
const { isOpen, open, close } = useConnectPopup()
const { scrollToSection } = useScrollToSection()

onMounted(() => {
  if (route.query.form !== undefined) open()
})

watch(
  () => route.query.form,
  (value) => {
    if (value !== undefined) {
      if (!isOpen.value) open()
      return
    }

    if (isOpen.value) close()
  }
)

const closeRef = ref<HTMLButtonElement | null>(null)
const blurRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const formContainerRef = ref<HTMLElement | null>(null)
const thanksContainerRef = ref<HTMLElement | null>(null)
const shown = ref(false)
const thanksShown = ref(false)
const closeIn = ref(CLOSE_IN_SECONDS)
let thanksTween: gsap.core.Timeline | null = null
let popupTween: gsap.core.Timeline | null = null
let motionId = 0
let closeTimerId = 0

const clearCloseTimer = () => {
  if (!closeTimerId) return
  window.clearInterval(closeTimerId)
  closeTimerId = 0
}

const startCloseTimer = () => {
  clearCloseTimer()
  closeIn.value = CLOSE_IN_SECONDS
  closeTimerId = window.setInterval(() => {
    if (closeIn.value <= 1) {
      clearCloseTimer()
      close()
      return
    }

    closeIn.value -= 1
  }, 1000)
}

const offscreenX = (element: HTMLElement) => {
  const right = Number.parseFloat(getComputedStyle(element).right) || 0
  return element.offsetWidth + right
}

const resetThanks = () => {
  clearCloseTimer()
  thanksTween?.kill()
  thanksTween = null
  thanksShown.value = false
  closeIn.value = CLOSE_IN_SECONDS
}

const goHome = () => {
  clearCloseTimer()
  close()
  scrollToSection("hero")
}

const finishClose = () => {
  popupTween?.kill()
  popupTween = null
  shown.value = false
  resetThanks()
  useLockScroll(false)
}

const playOpen = async () => {
  const id = ++motionId
  shown.value = true
  await nextTick()
  if (id !== motionId || !isOpen.value) return

  resetThanks()

  const blur = blurRef.value
  const container = containerRef.value
  if (!blur || !container) return

  if (!popupTween) {
    popupTween = gsap.timeline({
      paused: true,
      onComplete: () => {
        closeRef.value?.focus()
      },
      onReverseComplete: () => {
        if (isOpen.value) return
        finishClose()
      },
    })

    popupTween
      .fromTo(
        blur,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: transitionDurations.durS, ease: "custom.out" }
      )
      .fromTo(
        container,
        { x: () => offscreenX(container) },
        { x: 0, duration: transitionDurations.durM, ease: "custom.out" }
      )
  }

  popupTween.play()
}

const playClose = () => {
  motionId++

  if (!popupTween) {
    finishClose()
    return
  }

  popupTween.reverse()
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

  gsap.set(thanks, { yPercent: 100 })

  thanksTween = gsap.timeline()
  thanksTween
    .to(form, { yPercent: -100, duration, ease: "custom.in" })
    .to(thanks, { yPercent: 0, duration, ease: "custom.out" })

  startCloseTimer()
}

watch(isOpen, (open) => {
  if (!import.meta.client) return

  if (!open) {
    clearCloseTimer()
    window.removeEventListener("keydown", onKeydown)
    playClose()
    return
  }

  window.addEventListener("keydown", onKeydown)
  playOpen()
})

onUnmounted(() => {
  clearCloseTimer()
  popupTween?.kill()
  thanksTween?.kill()
  if (import.meta.client) window.removeEventListener("keydown", onKeydown)
  if (shown.value || isOpen.value) useLockScroll(false)
})
</script>

<style scoped lang="scss">
.popup {
  position: fixed;
  z-index: 2000;
  inset: 0;
  color: var(--c-black);
  overflow: hidden;
}

.popup-container {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  height: calc(100% - 1.5rem);
  width: calc(50% - 0.75rem);
  background: var(--c-white);
  z-index: 3;
  overflow: hidden;
  transform: translateX(calc(100% + 0.75rem));
  @include mobile {
    right: 0.5rem;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    top: 0.5rem;
    transform: translateX(calc(100% + 0.5rem));
  }
}
.popup-blur {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1rem);
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
}
.close {
  position: absolute;
  z-index: 3;
  top: 1rem;
  right: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  @include mobile {
    top: 0.5rem;
    width: 2.75rem;
    right: 0;
    background: none;
  }
}
.close:deep(svg) {
  transition: transform var(--dur-m) var(--custom-ease-in-out);
}
@include hover {
  .close:hover:deep(svg) {
    transform: rotate(180deg);
  }
}

.pane {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.pane::-webkit-scrollbar {
  display: none;
}

.form-pane {
  padding: 2rem 1.5rem 1.5rem;
  @include mobile {
    padding: 3rem 1rem 1rem;
  }
}

.title {
  margin-bottom: 6rem;
  @include mobile {
    margin-bottom: 3rem;
  }
}
.title br {
  @include mobile {
    display: none;
  }
}

.thanks-pane {
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  text-align: center;
}

.thanks-text {
  width: 36.25rem;
  max-width: 100%;
  text-align: center;
  @include mobile {
    width: 100%;
    padding: 0 1rem;
  }
}
.thanks-text br {
  @include mobile {
    display: none;
  }
}
.close-timer {
  position: absolute;
  bottom: 1.5rem;
  left: 0;
  width: 100%;
}
</style>
