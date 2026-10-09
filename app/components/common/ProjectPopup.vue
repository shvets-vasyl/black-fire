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
          <div class="descr p1" v-html="project.descr" />

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
            v-if="project.website"
            class="visit"
            external
            text="visit website"
            :href="project.website"
            grey
          />

          <img
            v-if="project.photos[0]"
            class="photo-mob"
            :src="project.photos[0]"
            :alt="project.name"
          />

          <div v-if="project.challenge || project.solution" class="details">
            <div v-if="project.challenge" class="details-item">
              <p class="details-label p1">Challenge</p>
              <div class="details-text" v-html="project.challenge" />
            </div>
            <div v-if="project.solution" class="details-item">
              <p class="details-label p1">Solution</p>
              <div class="details-text" v-html="project.solution" />
            </div>
          </div>
        </div>
        <div ref="photosRef" class="right">
          <template v-for="(asset, i) in loopedMedia" :key="`${project.slug}-${i}`">
            <video
              v-if="asset.type === 'video'"
              class="photo"
              :src="asset.url"
              :poster="asset.poster || undefined"
              muted
              playsinline
              loop
              autoplay
              preload="metadata"
              @loadeddata="onPhotoLoad"
            />
            <img
              v-else
              class="photo"
              :src="asset.url"
              :alt="project.name"
              @load="onPhotoLoad"
            />
          </template>
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
import { transitionDurations } from "~/utils/gsap-autoimport"

const route = useRoute()
const { isMobile } = useViewport()
const { data: projects } = await useProjects()
const { isOpen, project, open, close } = useProjectPopup()

const openFromQuery = (value: unknown) => {
  if (typeof value !== "string") return
  const item = projects.value?.find((entry) => entry.slug === value)
  if (!item) return
  if (isOpen.value && project.value?.slug === item.slug) return
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
const photosRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const shown = ref(false)
const copyCount = ref(3)

let setHeight = 0
let adjustLock = false
let didPlace = false
let photosObserver: ResizeObserver | null = null

const loopedMedia = computed(() => {
  const media = project.value?.media ?? []
  if (!media.length) return []
  if (isMobile.value) return media.slice(1)
  return Array.from({ length: copyCount.value }, () => media).flat()
})

const measureSet = () => {
  const right = photosRef.value
  const pane = paneRef.value
  const count = project.value?.media.length ?? 0
  if (!right || !pane || isMobile.value || !count) {
    setHeight = 0
    return
  }

  const nodes = [...right.querySelectorAll<HTMLElement>(".photo")]
  if (nodes.length < count * 2) return

  const firstSet = nodes.slice(0, count)
  const nextFirst = nodes[count]
  const ready = (node: HTMLElement | undefined) => {
    if (node instanceof HTMLVideoElement) return node.readyState >= 1
    if (node instanceof HTMLImageElement) return node.complete && node.naturalHeight > 0
    return false
  }
  if (!firstSet.every(ready) || !ready(nextFirst)) return

  const height = nextFirst.offsetTop - firstSet[0].offsetTop
  if (height <= 0) return

  const needed = Math.max(3, Math.ceil(pane.clientHeight / height) + 3)
  if (needed > copyCount.value) copyCount.value = Math.min(needed, 24)

  const prev = setHeight
  setHeight = height

  if (!didPlace) {
    adjustLock = true
    pane.scrollTop = height + pane.scrollTop
    adjustLock = false
    didPlace = true
  } else if (prev > 0 && Math.abs(prev - height) > 1) {
    const ratio = (pane.scrollTop - prev) / prev
    adjustLock = true
    pane.scrollTop = height * (1 + ratio)
    adjustLock = false
  }

  normalizeScroll()
}

const normalizeScroll = () => {
  const pane = paneRef.value
  if (!pane || setHeight <= 0 || adjustLock) return

  let top = pane.scrollTop
  if (top >= setHeight * 2) {
    top -= setHeight * Math.floor((top - setHeight) / setHeight)
  } else if (top < setHeight) {
    top += setHeight
  }

  if (top === pane.scrollTop) return

  adjustLock = true
  pane.scrollTop = top
  adjustLock = false
}

const updateProgress = () => {
  if (isMobile.value || adjustLock) return
  const pane = paneRef.value
  if (!pane) return

  if (setHeight > 0) {
    normalizeScroll()
    progress.value = Math.min(1, Math.max(0, (pane.scrollTop - setHeight) / setHeight))
    return
  }

  if (project.value?.media.length) {
    progress.value = 0
    return
  }

  const max = pane.scrollHeight - pane.clientHeight
  progress.value = max > 0 ? pane.scrollTop / max : 1
}

const onPhotoLoad = () => {
  measureSet()
  updateProgress()
}

const resetLoop = async () => {
  didPlace = false
  setHeight = 0
  copyCount.value = 3
  progress.value = 0
  await nextTick()
  if (paneRef.value) paneRef.value.scrollTop = 0
  measureSet()
  updateProgress()
}

watch(project, () => {
  resetLoop()
})

watch(isMobile, () => {
  if (!shown.value) return
  resetLoop()
})

watch(photosRef, (photos) => {
  photosObserver?.disconnect()
  photosObserver = null
  if (!photos) return

  photosObserver = new ResizeObserver(() => {
    measureSet()
    updateProgress()
  })
  photosObserver.observe(photos)
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
  photosObserver?.disconnect()
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
  overflow-anchor: none;
  scrollbar-width: none;
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
  display: block;
}

.descr {
  line-height: 1.25rem;
  margin-bottom: 1.5rem;
}
.descr:deep(p),
.details-text:deep(p) {
  margin: 0;
}
.descr:deep(ul),
.details-text:deep(ul),
.descr:deep(ol),
.details-text:deep(ol) {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}
.descr:deep(ul),
.details-text:deep(ul) {
  list-style: disc;
}
.descr:deep(ol),
.details-text:deep(ol) {
  list-style: decimal;
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

.visit {
  margin-bottom: 2rem;
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

.info-item {
  padding-right: 0.5rem;
}
</style>
