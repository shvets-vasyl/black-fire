<template>
  <section ref="sectionRef" class="brands">
    <div class="title p2">
      <p data-anim-text>more than 100 brand have already trusted us</p>
    </div>

    <div class="viewport" data-anim-fade data-lenis-prevent-horizontal>
      <div ref="itemsRef" class="items">
        <div v-for="(brand, i) in brands" :key="`${brand}-${i}`" class="item">
          <img :src="brand" alt="" draggable="false" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { horizontalLoop, type HorizontalLoopTimeline } from "~/utils/horizontalLoop"

const sectionRef = ref<HTMLElement | null>(null)
const itemsRef = ref<HTMLElement | null>(null)

const brands = [
  "/images/logo-1.svg",
  "/images/logo-2.svg",
  "/images/logo-3.svg",
  "/images/logo-4.svg",
  "/images/logo-1.svg",
  "/images/logo-2.svg",
  "/images/logo-3.svg",
  "/images/logo-4.svg",
  "/images/logo-1.svg",
  "/images/logo-2.svg",
  "/images/logo-3.svg",
  "/images/logo-4.svg",
]

let loop: HorizontalLoopTimeline | null = null
let visibilityTrigger: ScrollTrigger | null = null

useAfterTransition(() => {
  const section = sectionRef.value
  const itemsRoot = itemsRef.value
  if (!section || !itemsRoot) return

  const items = itemsRoot.querySelectorAll<HTMLElement>(".item")
  const gap = Number.parseFloat(getComputedStyle(itemsRoot).gap) || 0

  loop = horizontalLoop(items, {
    repeat: -1,
    speed: 0.9,
    paused: true,
    draggable: true,
    snap: false,
    paddingRight: gap,
    allowNativeTouchScrolling: true,
  })

  const syncPlayback = (active: boolean) => {
    if (active) loop?.resume()
    else loop?.pause()
  }

  visibilityTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => syncPlayback(self.isActive),
  })

  syncPlayback(visibilityTrigger.isActive)
})

onBeforeUnmount(() => {
  visibilityTrigger?.kill()
  loop?.revertLoop()
})
</script>

<style scoped lang="scss">
.brands {
  padding-bottom: 14rem;
  @include mobile {
    padding-bottom: 10rem;
  }
}
.title {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.5;
}
.viewport {
  overflow: hidden;
}
.items {
  display: flex;
  gap: 0.75rem;
  width: max-content;
  touch-action: pan-y;
  user-select: none;
}
.item {
  flex-shrink: 0;
  width: 18.75rem;
  height: 18.75rem;
  border: 0.0625rem solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  @include mobile {
    width: 12rem;
    height: 12rem;
  }
}
.item img {
  height: 2rem;
  width: auto;
  pointer-events: none;
  @include mobile {
    height: 1.5rem;
  }
}
</style>
