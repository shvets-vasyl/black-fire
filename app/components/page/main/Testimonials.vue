<template>
  <section ref="sectionRef" class="testimonials">
    <div class="head">
      <CommonSubtitle text="testimonials" data-anim-text />
      <h2 class="title h2" data-anim-title>trust us</h2>
    </div>

    <div
      ref="viewportRef"
      class="viewport"
      data-anim-fade
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        class="items"
        :class="{ 'is-dragging': dragging, 'is-instant': instant }"
        :style="trackStyle"
        @transitionend="onTrackTransition"
      >
        <div
          v-for="({ text, name, position, photo }, i) in slides"
          :key="i"
          class="item"
          :aria-hidden="i >= items.length ? true : undefined"
        >
          <IconQuote />

          <h5 class="item-text h5">{{ text }}</h5>

          <div class="item-person">
            <div class="person-photo">
              <img class="inner-media" draggable="false" :src="photo" :alt="name" />
            </div>
            <div class="person-info">
              <p v-if="name" class="item-name p1">{{ name }}</p>
              <p class="item-position p1" :class="{ 'is-only': !name }">{{ position }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nav" :class="{ 'is-dragging': dragging, 'is-instant': instant }">
      <div class="nav-arrows">
        <button
          class="nav-btn is-prev"
          type="button"
          aria-label="Previous testimonial"
          :disabled="index === 0 || index >= items.length"
          @click="step(-1)"
        >
          <IconArrow />
        </button>
        <button
          class="nav-btn"
          type="button"
          aria-label="Next testimonial"
          :disabled="index >= items.length - 1"
          @click="step(1)"
        >
          <IconArrow />
        </button>
      </div>

      <div class="progress" aria-hidden="true">
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
  </section>
</template>

<script setup lang="ts">
const AUTO_DELAY = 5000

const { isMobile } = useViewport()
const sectionRef = ref<HTMLElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const index = ref(0)
const slideWidth = ref(0)
const dragging = ref(false)
const holding = ref(false)
const instant = ref(false)
const dragX = ref(0)
const inView = ref(false)
const pageVisible = ref(true)
const reducedMotion = ref(false)

let autoTimer = 0
let wrapTimer = 0
let observer: IntersectionObserver | null = null

let pointerId = -1
let startX = 0
let startY = 0
let baseX = 0
let axis: "x" | "y" | null = null

const measure = () => {
  slideWidth.value = viewportRef.value?.clientWidth ?? 0
}

const trackStyle = computed(() => {
  if (!isMobile.value || !slideWidth.value) return undefined

  const x = dragging.value ? dragX.value : -index.value * slideWidth.value

  return { transform: `translate3d(${x}px, 0, 0)` }
})

const step = (direction: number) => {
  if (index.value >= items.length) return
  index.value = Math.min(items.length - 1, Math.max(0, index.value + direction))
}

const stopAuto = () => {
  if (autoTimer) {
    window.clearTimeout(autoTimer)
    autoTimer = 0
  }
  if (wrapTimer) {
    window.clearTimeout(wrapTimer)
    wrapTimer = 0
  }
}

const startAuto = () => {
  stopAuto()
  if (!isMobile.value || dragging.value || holding.value || instant.value) return
  if (!inView.value || !pageVisible.value || reducedMotion.value) return
  if (items.length < 2) return

  if (index.value >= items.length) {
    wrapTimer = window.setTimeout(() => {
      wrapTimer = 0
      if (index.value === items.length) jumpTo(0)
    }, 700)
    return
  }

  autoTimer = window.setTimeout(() => {
    autoTimer = 0
    index.value = index.value >= items.length - 1 ? items.length : index.value + 1
  }, AUTO_DELAY)
}

const jumpTo = (next: number) => {
  instant.value = true
  index.value = next
  nextTick(() => {
    viewportRef.value?.getBoundingClientRect()
    requestAnimationFrame(() => {
      instant.value = false
    })
  })
}

const onTrackTransition = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget || event.propertyName !== "transform") return
  if (index.value !== items.length) return
  jumpTo(0)
}

const finishDrag = () => {
  if (dragging.value && axis === "x" && slideWidth.value) {
    const delta = dragX.value - baseX
    const threshold = Math.min(48, slideWidth.value * 0.18)

    if (delta <= -threshold) step(1)
    else if (delta >= threshold) step(-1)
  }

  dragging.value = false
  holding.value = false
  axis = null
  pointerId = -1
}

const onPointerDown = (event: PointerEvent) => {
  if (!isMobile.value || event.button !== 0) return

  if (index.value >= items.length) jumpTo(0)

  pointerId = event.pointerId
  holding.value = true
  startX = event.clientX
  startY = event.clientY
  baseX = -index.value * slideWidth.value
  dragX.value = baseX
  axis = null
}

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== pointerId || pointerId === -1) return

  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  if (!axis) {
    if (Math.hypot(deltaX, deltaY) < 6) return
    axis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y"
    if (axis === "y") {
      pointerId = -1
      holding.value = false
      return
    }

    dragging.value = true
    try {
      viewportRef.value?.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture is unavailable for this event.
    }
  }

  if (axis !== "x" || !slideWidth.value) return

  let x = baseX + deltaX
  const min = -(items.length - 1) * slideWidth.value

  if (x > 0) x *= 0.35
  if (x < min) x = min + (x - min) * 0.35

  dragX.value = x
}

const onPointerUp = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  if (viewportRef.value?.hasPointerCapture(event.pointerId)) {
    viewportRef.value.releasePointerCapture(event.pointerId)
  }
  finishDrag()
}

const onPageVisibility = () => {
  pageVisible.value = document.visibilityState !== "hidden"
}

onMounted(() => {
  measure()
  window.addEventListener("resize", measure)
  document.addEventListener("visibilitychange", onPageVisibility)
  reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const section = sectionRef.value
  if (!section) return

  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = !!entry?.isIntersecting
    },
    { threshold: 0, rootMargin: "-20% 0px -20% 0px" }
  )
  observer.observe(section)
})

onBeforeUnmount(() => {
  stopAuto()
  observer?.disconnect()
  window.removeEventListener("resize", measure)
  document.removeEventListener("visibilitychange", onPageVisibility)
})

watch(isMobile, (mobile) => {
  dragging.value = false
  holding.value = false
  axis = null
  pointerId = -1
  if (!mobile) index.value = 0
  measure()
})

watch(
  [index, dragging, holding, instant, isMobile, inView, pageVisible, reducedMotion],
  startAuto
)

const items = [
  {
    text: "BlackFire handles any task, from targeted advertising to website development. Whenever I need strong designers or marketers, they're the team I turn to. Everything is delivered on time and at the highest level.",
    name: "Liubov Dziuzhynska",
    position: "CEO @ DogaDoga",
    photo: "/images/dogga.jpg",
  },
  {
    text: "BlackFire designed our internal CRM, created the motion design and took part in developing the Trady platform. I liked their approach and how well the team is organized internally. What I valued most was their help with things studios usually don't do, like legal matters.",
    name: "",
    position: "CEO @ Trady",
    photo: "/images/trady.jpg",
  },
  {
    text: "When we started working on the NFT collection, I didn't believe it could be done in a month. What impressed me most was how quickly I received progress updates. We could change direction on the fly, and the team adapted to my requests right away. I'm very happy with our collaboration.",
    name: "",
    position: "Founder @ American Heroes",
    photo: "/images/heroes.jpg",
  },
]

const slides = computed(() => (isMobile.value ? [...items, items[0]!] : items))

const progress = computed(() => {
  const span = items.length - 1
  if (span <= 0 || !slideWidth.value) return 0

  const x = dragging.value ? dragX.value : -index.value * slideWidth.value
  return Math.min(1, Math.max(0, -x / (span * slideWidth.value)))
})
</script>

<style scoped lang="scss">
.testimonials {
  padding-bottom: 14rem;
  @include mobile {
    padding-bottom: 10rem;
  }
}
.head {
  padding: 0 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @include mobile {
    padding: 0 1rem 4rem;
  }
}

.person-photo {
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  position: relative;
  border-radius: 0.5rem;
}
.item-person {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 6rem;
  @include mobile {
    padding-top: 3rem;
    border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.1);
    padding-bottom: 1.5rem;
  }
}
.item-name,
.item-position {
  line-height: 1.25rem;
}
.item-position {
  opacity: 0.5;
  &.is-only {
    opacity: 1;
  }
}
.viewport {
  @include mobile {
    overflow: hidden;
    touch-action: pan-y;
    user-select: none;
  }
}
.items {
  display: flex;
  @include mobile {
    transition: transform 0.6s var(--custom-ease-out);
    &.is-dragging,
    &.is-instant {
      transition: none;
    }
  }
}
.item-text {
  margin-top: 1rem;
}
.item {
  flex: 0 0 33.33%;
  display: flex;
  flex-direction: column;
  padding: 0 2rem 0 1.5rem;
  @include mobile {
    flex: 0 0 100%;
    width: 100%;
    padding: 0 1rem;
  }
}
.item:not(:last-child) {
  border-right: 0.0625rem solid rgba(0, 0, 0, 0.1);
  @include mobile {
    border-right: none;
  }
}
.nav {
  display: none;
  @include mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 1rem 0;
  }
}
.nav-arrows {
  display: flex;
  gap: 0.5rem;
}
.progress-svg {
  width: 1.75rem;
  height: 1.75rem;
}
.progress-svg circle:last-child {
  transition: stroke-dashoffset 0.6s var(--custom-ease-out);
}
.nav.is-dragging .progress-svg circle:last-child,
.nav.is-instant .progress-svg circle:last-child {
  transition: none;
}
.nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  color: var(--c-black);
  transition: opacity 0.3s ease;

  &.is-prev {
    transform: rotate(180deg);
  }

  &:disabled {
    opacity: 0.28;
    pointer-events: none;
  }
}
</style>
