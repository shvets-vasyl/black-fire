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
            v-for="({ title, descr }, i) in items"
            :key="i"
            class="item"
            :class="{ 'is-active': activeIndex === i }"
            @pointerenter="onItemEnter(i, $event)"
          >
            <h2 class="item-title h2" data-anim-title>{{ title }}</h2>

            <div class="item-content">
              <div class="item-descr">
                <p class="p1" data-anim-text>{{ descr }}</p>
              </div>
            </div>

            <div class="item-progress">
              <div class="progress-line" />
            </div>
          </div>
        </div>

        <CommonButtonTemplate data-anim-fade text="let's talk" black />
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

const sectionRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let lines: HTMLElement[] = []
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

const onItemsLeave = (event: PointerEvent) => {
  if (event.pointerType === "touch") return
  hovered = false
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
})
</script>

<style scoped lang="scss">
.services {
  padding: 14rem 1.5rem;
}
.content {
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 21.1875rem 50%;
  justify-content: space-between;
}
.left {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.photos {
  height: 21.1875rem;
  position: relative;
  overflow: hidden;
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
}
.item-title {
  padding: 1rem 0;
}
.item-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.item.is-active .item-content {
  grid-template-rows: 1fr;
}
.item-descr {
  min-height: 0;
  overflow: hidden;
}
.item-descr p {
  width: 28.5rem;
  padding: 1rem 0;
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
</style>
