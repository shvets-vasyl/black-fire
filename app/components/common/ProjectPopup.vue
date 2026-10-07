<template>
  <div
    v-if="shown"
    class="popup"
    role="dialog"
    aria-modal="true"
    :aria-label="project?.name"
  >
    <div ref="blurRef" class="popup-blur" @click="close" />

    <div ref="containerRef" class="popup-container">
      <button ref="closeRef" class="close" type="button" @click="close">
        <IconClose />
      </button>

      <div
        v-if="project"
        ref="paneRef"
        class="pane"
        data-lenis-prevent
        @scroll.passive="updateProgress"
      >
        <div class="left">
          <h3 class="title h3">{{ project.name }}</h3>
          <p class="descr p1" v-html="project.descr" />

          <div class="info">
            <div class="info-item">
              <p class="info-title p2">Service</p>
              <p class="p2">{{ project.services.join(", ") }}</p>
            </div>
            <div class="info-item">
              <p class="info-title p2">Type</p>
              <p class="p2">{{ project.category.join(", ") }}</p>
            </div>
            <div class="info-item">
              <p class="info-title p2">Date</p>
              <p class="p2">{{ project.year }}</p>
            </div>
          </div>

          <CommonButtonTemplate
            :href="project.websiteLink"
            grey
            external
            text="visit website"
          />

          <img class="photo-mob" :src="project.photos[0]" :alt="project.name" />

          <div class="details">
            <div class="details-item">
              <p class="details-label p1">Challenge</p>
              <p class="details-text">{{ project.challenge }}</p>
            </div>
            <div class="details-item">
              <p class="details-label p1">Solution</p>
              <p class="details-text">{{ project.solution }}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <img
            v-for="(photo, i) in isMobile ? project.photos.slice(1) : project.photos"
            :key="i"
            class="photo"
            :src="photo"
            :alt="project.name"
            @load="updateProgress"
          />
        </div>
      </div>

      <div v-if="project && !isMobile" class="progress">
        <svg class="progress-svg" viewBox="0 0 28 28" fill="none">
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="black"
            stroke-opacity="0.1"
            stroke-width="2"
          />
          <circle
            cx="14"
            cy="14"
            r="13"
            stroke="black"
            stroke-width="2"
            pathLength="1"
            stroke-dasharray="1"
            :stroke-dashoffset="1 - progress"
            transform="rotate(-90 14 14)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findProject } from "~/data/projects"
import { transitionDurations } from "~/utils/gsap-autoimport"

const route = useRoute()
const { isMobile } = useViewport()
const { isOpen, project, open, close } = useProjectPopup()

const openFromQuery = (value: unknown) => {
  if (typeof value !== "string") return
  const item = findProject(value)
  if (!item) return
  if (isOpen.value && project.value?.name === item.name) return
  open(item)
}

onMounted(() => {
  openFromQuery(route.query.project)
})

watch(
  () => route.query.project,
  (value) => {
    if (value !== undefined) {
      openFromQuery(value)
      return
    }

    if (isOpen.value) close()
  }
)

const closeRef = ref<HTMLButtonElement | null>(null)
const blurRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const paneRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const shown = ref(false)

const updateProgress = () => {
  if (isMobile.value) return
  const pane = paneRef.value
  if (!pane) return
  const max = pane.scrollHeight - pane.clientHeight
  progress.value = max > 0 ? pane.scrollTop / max : 1
}

watch(project, async () => {
  await nextTick()
  if (paneRef.value) paneRef.value.scrollTop = 0
  updateProgress()
})
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
    right: 0.5rem;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  overflow-y: auto;
  @include mobile {
    display: flex;
    flex-direction: column;
    padding: 2.75rem 1rem 1rem;
  }
}
.pane::-webkit-scrollbar {
  display: none;
}
.left {
  position: sticky;
  top: 0;
  padding: 2rem 1.5rem 1.5rem;
  @include mobile {
    position: static;
    padding: 0;
  }
}
.right {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 7.3125rem 0.75rem 0;
  gap: 0.75rem;
  @include mobile {
    padding: 0;
  }
}

.title {
  margin-bottom: 1.5rem;
}
.photo {
  width: 100%;
}

.descr {
  line-height: 1.25rem;
  margin-bottom: 1.5rem;
}
.descr:deep(br) {
  @include mobile {
    display: none;
  }
}

.info {
  display: grid;
  grid-template-columns: 12.5rem 7.875rem 3.75rem;
  gap: 1rem;
  margin-bottom: 2rem;
  @include mobile {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
  }
}
.info-item:not(:last-child) {
  border-right: 0.0625rem solid rgba(0, 0, 0, 0.1);
}
.info-item:not(:first-child) {
  @include mobile {
    padding-left: 1rem;
  }
}
.info-title {
  opacity: 0.5;
  margin-bottom: 0.25rem;
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 4rem;
  @include mobile {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
.details-label {
  margin-bottom: 0.75rem;
}
.details-text {
  opacity: 0.5;
  font-size: 0.875rem;
  line-height: 1.125rem;
}

.progress {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  @include mobile {
    display: none;
  }
}
.progress-svg {
  width: 1.75rem;
  height: 1.75rem;
}

.photo-mob {
  display: none;
  @include mobile {
    display: block;
    width: 100%;
    margin-top: 3rem;
  }
}
</style>
