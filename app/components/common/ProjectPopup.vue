<template>
  <div
    v-if="shown"
    class="popup"
    role="dialog"
    aria-modal="true"
    :aria-label="projectName"
  >
    <div ref="blurRef" class="popup-blur" @click="close" />

    <div ref="containerRef" class="popup-container">
      <button ref="closeRef" class="close" type="button" @click="close">
        <IconClose />
      </button>

      <div class="pane" data-lenis-prevent>
        <p class="eyebrow p2">Project</p>
        <h2 class="title h3">{{ projectName }}</h2>

        <p class="lead p1">
          A brand, a site and a campaign built as one system — so {{ projectName }} reads
          the same in every place a person meets it.
        </p>

        <div class="facts">
          <div class="fact">
            <p class="fact-label p2">Client</p>
            <p class="fact-value">{{ projectName }}</p>
          </div>
          <div class="fact">
            <p class="fact-label p2">Scope</p>
            <p class="fact-value">Brand, website, film</p>
          </div>
          <div class="fact">
            <p class="fact-label p2">Status</p>
            <p class="fact-value">Selected work</p>
          </div>
        </div>

        <p class="body p1">
          The case itself is still just a name. The rest of the story — the pictures, the
          process and the outcome — will sit here once the project has more than a title.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { transitionDurations } from "~/utils/gsap-autoimport"

const route = useRoute()
const { isOpen, projectName, close } = useProjectPopup()

const closeRef = ref<HTMLButtonElement | null>(null)
const blurRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const shown = ref(false)
let popupTween: gsap.core.Timeline | null = null
let motionId = 0

const offscreenY = (element: HTMLElement) => {
  const bottom = Number.parseFloat(getComputedStyle(element).bottom) || 0
  return element.offsetHeight + bottom
}

const finishClose = () => {
  popupTween?.kill()
  popupTween = null
  shown.value = false
  useLockScroll(false)
}

const playOpen = async () => {
  const id = ++motionId
  shown.value = true
  await nextTick()
  if (id !== motionId || !isOpen.value) return

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
        { y: () => offscreenY(container) },
        { y: 0, duration: transitionDurations.durM, ease: "custom.out" }
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

watch(isOpen, (open) => {
  if (!import.meta.client) return

  if (!open) {
    window.removeEventListener("keydown", onKeydown)
    playClose()
    return
  }

  window.addEventListener("keydown", onKeydown)
  playOpen()
})

watch(
  () => route.path,
  () => {
    if (isOpen.value) close()
  }
)

onUnmounted(() => {
  popupTween?.kill()
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
  left: 0.75rem;
  bottom: 0.75rem;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);
  background: var(--c-white);
  z-index: 3;
  overflow: hidden;
  transform: translateY(calc(100% + 0.75rem));
  @include mobile {
    left: 0.5rem;
    bottom: 0.5rem;
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    transform: translateY(calc(100% + 0.5rem));
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
  padding: 2rem 1.5rem 1.5rem;
  @include mobile {
    padding: 3rem 1rem 1rem;
  }
}

.pane::-webkit-scrollbar {
  display: none;
}

.eyebrow {
  opacity: 0.5;
  margin-bottom: 1rem;
}

.title {
  margin-bottom: 2rem;
  max-width: 43rem;
}

.lead {
  max-width: 36rem;
  margin-bottom: 3rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 16rem));
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding-top: 1.5rem;
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.1);
  @include mobile {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.fact-label {
  opacity: 0.5;
  margin-bottom: 0.25rem;
}

.body {
  max-width: 36rem;
  opacity: 0.7;
}
</style>
