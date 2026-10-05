<template>
  <section id="services" ref="sectionRef" class="services">
    <div class="content">
      <div class="left" data-anim-fade>
        <CommonSubtitle text="our services" />

        <div class="photos">
          <div
            v-for="({ photo }, i) in items"
            :key="i"
            class="photo"
            :class="{ 'is-active': activeIndex === i }"
          >
            <img class="inner-media" draggable="false" :src="photo" alt="" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="items" @pointerleave="onItemsLeave">
          <div
            v-for="({ title, descr, photo }, i) in items"
            :key="i"
            class="item"
            :class="{ 'is-active': activeIndex === i }"
            @pointerenter="onItemEnter(i, $event)"
            @click="onItemClick(i)"
            @transitionend="onItemTransitionEnd"
          >
            <h2 class="item-title h2" data-anim-title>{{ title }}</h2>

            <div class="item-content">
              <div class="item-descr">
                <p class="p1" data-anim-text>{{ descr }}</p>
              </div>

              <div class="item-photo">
                <img class="inner-media" draggable="false" :src="photo" :alt="title" />
              </div>
            </div>

            <div class="item-progress">
              <div class="progress-line" />
            </div>
          </div>
        </div>

        <CommonButtonTemplate data-anim-fade text="let's talk" black @click="openConnect" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const AUTO_DURATION = 5

const items = [
  {
    title: "Design",
    descr:
      "Brand identity, UX/UI and visuals that make your business recognizable and easy to use.",
    photo: "/images/services.webp",
  },
  {
    title: "Development",
    descr:
      "Brand identity, UX/UI and visuals that make your business recognizable and easy to use.",
    photo: "/images/services.webp",
  },
  {
    title: "Marketing",
    descr:
      "Brand identity, UX/UI and visuals that make your business recognizable and easy to use.",
    photo: "/images/services.webp",
  },
  {
    title: "Production",
    descr:
      "Brand identity, UX/UI and visuals that make your business recognizable and easy to use.",
    photo: "/images/services.webp",
  },
]

const { open: openConnect } = useConnectPopup()
const sectionRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const { isMobile } = useViewport()

let lines: HTMLElement[] = []
let refreshFrame = 0
let active = 0
let progress = 0
let hovered = false
let inView = false
let visibilityTrigger: ScrollTrigger | null = null

const paintProgress = () => {
  const line = lines[active]
  if (!line) return
  line.style.transform = `scaleX(${progress})`
}

const setActive = (index: number) => {
  if (lines[active]) lines[active].style.transform = "scaleX(0)"
  active = index
  activeIndex.value = index
  progress = 0
  paintProgress()
}

const onTick = () => {
  if (!inView || hovered) return

  const delta = Math.min(gsap.ticker.deltaRatio(60), 2)
  progress += delta / (AUTO_DURATION * 60)

  if (progress >= 1) {
    setActive((active + 1) % items.length)
    return
  }

  paintProgress()
}

const onItemEnter = (index: number, event: PointerEvent) => {
  if (event.pointerType === "touch") return
  hovered = true
  if (index !== active) setActive(index)
}

const onItemClick = (index: number) => {
  if (!isMobile.value) return
  if (index !== active) setActive(index)
}

const onItemsLeave = (event: PointerEvent) => {
  if (event.pointerType === "touch") return
  hovered = false
}

const onItemTransitionEnd = (event: TransitionEvent) => {
  if (!isMobile.value) return
  if (event.target !== event.currentTarget) return
  if (event.propertyName !== "grid-template-rows") return

  window.cancelAnimationFrame(refreshFrame)
  refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
}

onMounted(() => {
  const section = sectionRef.value
  if (!section) return

  lines = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".progress-line"))

  visibilityTrigger = ScrollTrigger.create({
    trigger: section,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      inView = self.isActive
    },
  })

  inView = visibilityTrigger.isActive
  gsap.ticker.add(onTick)
})

onBeforeUnmount(() => {
  gsap.ticker.remove(onTick)
  visibilityTrigger?.kill()
  window.cancelAnimationFrame(refreshFrame)
})
</script>

<style scoped lang="scss">
.services {
  padding: 14rem 1.5rem;
  @include mobile {
    padding: 10rem 1rem;
  }
}
.content {
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 21.1875rem 50%;
  justify-content: space-between;
  @include mobile {
    display: flex;
    flex-direction: column;
  }
}
.left {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @include mobile {
    margin-bottom: 1.75rem;
  }
}
.photos {
  height: 21.1875rem;
  position: relative;
  overflow: hidden;
  @include mobile {
    display: none;
  }
}
.photo {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1);

  &.is-active {
    opacity: 1;
    z-index: 1;
  }
}
.item {
  cursor: pointer;
  display: grid;
  grid-template-rows: auto 0fr auto;
  transition: grid-template-rows 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.item.is-active {
  grid-template-rows: auto 1fr auto;
}
.item-title {
  padding: 1rem 0;
  @include mobile {
    padding: 1.25rem 0;
  }
}
.item-content {
  min-height: 0;
  overflow: hidden;
}
.item-descr p {
  width: 28.5rem;
  padding: 1rem 0;
  @include mobile {
    width: 100%;
    padding: 0.25rem 0 1.5rem;
  }
}
.item-progress {
  height: 0.0625rem;
  background: rgba(0, 0, 0, 0.1);
}
.progress-line {
  height: 100%;
  width: 100%;
  background: #000;
  transform: scaleX(0);
  transform-origin: left center;
}
.items {
  margin-bottom: 3rem;
}
.item-photo {
  display: none;
  @include mobile {
    display: block;
    position: relative;
    height: 21.4375rem;
    width: 100%;
    margin-bottom: 1.5rem;
  }
}
</style>
