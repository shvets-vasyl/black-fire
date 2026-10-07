<template>
  <section class="hero">
    <div class="head">
      <h3 ref="filtersEl" class="filters h3">
        <button
          v-for="(filter, index) in filters"
          :key="filter"
          class="filter"
          :class="{ 'is-active': active === filter }"
          type="button"
          :aria-pressed="active === filter"
          @click="setFilter(filter)"
        >
          {{ filter }}
          <span
            v-if="index < filters.length - 1 && index !== 2"
            class="filter-slash"
            aria-hidden="true"
            >/</span
          >
        </button>
      </h3>
    </div>

    <div ref="infoEl" class="info">
      <div class="info-total p2">
        <div class="total-wrap">
          <p>{{ totalTitle }}</p>
          <div class="info-square" />
          <p>{{ projectsLabel }}</p>
        </div>
      </div>

      <p class="descr p1">
        A collection of brands, websites and digital systems built for companies moving
        into their next chapter.
      </p>
    </div>

    <div ref="itemsEl" class="items">
      <div
        v-for="({ name, photo, services, year, category }, i) in visibleItems"
        :key="i"
        class="item"
      >
        <div class="item-photo">
          <img class="inner-media" draggable="false" :src="photo" :alt="name" />
        </div>

        <div class="item-gradient" />

        <div class="item-info">
          <h3 class="item-title">
            <div class="title-arrow">
              <IconArrow2 />
            </div>
            <div class="title-text">{{ name }}</div>
          </h3>

          <div class="item-details">
            <div class="item-services p2">
              <span v-for="(service, s) in services" :key="s" class="item-service">
                {{ service }}{{ s < services.length - 1 ? ", " : "" }}
              </span>
            </div>
            <div class="item-year p2">
              <span class="year-text">
                {{ year }}
              </span>
            </div>
            <div class="item-category p2">
              <span v-for="(cat, c) in category" :key="c" class="item-cat">
                {{ cat }}{{ c < category.length - 1 ? ", " : "" }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { animateFadeDefault, animateTitleDefault } from "~/utils/animations"
import { transitionDurations } from "~/utils/gsap-autoimport"
const items = [
  {
    category: ["design"],
    services: ["production", "marketing"],
    year: "2025",
    name: "Zinchenko",
    photo: "/images/work/work-1.webp",
  },
  {
    category: ["development"],
    services: ["design", "production"],
    year: "2025",
    name: "Kovalenko",
    photo: "/images/work/work-2.webp",
  },
  {
    category: ["marketing"],
    services: ["design", "development"],
    year: "2024",
    name: "Horizon",
    photo: "/images/work/work-3.webp",
  },
  {
    category: ["production"],
    services: ["development", "marketing"],
    year: "2024",
    name: "Forma",
    photo: "/images/work/work-4.webp",
  },
  {
    category: ["design", "marketing"],
    services: ["production"],
    year: "2023",
    name: "Mono",
    photo: "/images/work/work-5.webp",
  },
  {
    category: ["development", "production"],
    services: ["design", "marketing"],
    year: "2023",
    name: "North",
    photo: "/images/work/work-6.webp",
  },
]

const filters = ["all", ...new Set(items.flatMap((item) => item.category))]

const active = ref("all")
const filtersEl = ref<HTMLElement | null>(null)
const infoEl = ref<HTMLElement | null>(null)
const itemsEl = ref<HTMLElement | null>(null)

let intros: gsap.core.Animation[] = []
let pendingPlay = false

const initIntro = () => {
  intros = []

  if (filtersEl.value) {
    intros.push(animateTitleDefault(filtersEl.value, { type: "enter" }).pause(0))
  }

  if (infoEl.value) {
    intros.push(animateFadeDefault(infoEl.value, { type: "enter" }).pause(0))
  }

  if (itemsEl.value) {
    intros.push(animateFadeDefault(itemsEl.value, { type: "enter" }).pause(0))
  }

  if (pendingPlay) playIntro()
}

const playIntro = () => {
  if (!intros.length) {
    pendingPlay = true
    return
  }

  pendingPlay = false
  intros.forEach((animation) => animation.play())
}

const visibleItems = computed(() =>
  active.value === "all"
    ? items
    : items.filter((item) => item.category.includes(active.value))
)

const visibleCount = computed(() => visibleItems.value.length)

let motion = 0

const setFilter = async (id: string) => {
  if (id === active.value) return

  const el = itemsEl.value
  if (!el) {
    active.value = id
    return
  }

  const run = ++motion
  gsap.killTweensOf(el)

  await gsap.to(el, {
    y: "2rem",
    autoAlpha: 0,
    duration: transitionDurations.durS,
    ease: "custom.in",
  })
  if (run !== motion) return

  active.value = id
  await nextTick()
  if (run !== motion) return

  gsap.fromTo(
    el,
    { y: "3rem", autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: transitionDurations.durM,
      ease: "custom.out",
      clearProps: "transform,opacity,visibility",
      onComplete: () => ScrollTrigger.refresh(),
    }
  )
}

onMounted(async () => {
  await document.fonts.ready
  initIntro()
})

useAfterTransition(() => {
  playIntro()
})

onBeforeUnmount(() => {
  intros.forEach((animation) => animation.kill())
  if (itemsEl.value) gsap.killTweensOf(itemsEl.value)
})

const totalTitle = computed(() => (active.value === "all" ? "all work" : active.value))

const projectsLabel = computed(() => {
  const count = visibleCount.value
  return `${count} ${count === 1 ? "project" : "projects"}`
})
</script>

<style scoped lang="scss">
.hero {
  padding: 0 1.5rem;
  @include mobile {
    padding: 0 1rem;
  }
}
.head {
  padding: 12.5rem 0 10rem;
  display: flex;
  justify-content: center;
  @include mobile {
    padding: 9rem 0 7rem;
  }
}

.filter {
  display: inline-flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity var(--dur-m) var(--custom-ease-out);
  @include mobile {
    display: block;
    width: 100%;
  }
}
.filter.is-active {
  opacity: 1;
}
@include hover {
  .filter:hover {
    opacity: 1;
  }
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
  padding-bottom: 1.5rem;
  border-bottom: 0.0625rem solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  @include mobile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.info-square {
  width: 0.25rem;
  height: 0.25rem;
  background-color: var(--c-white);
}

.total-wrap {
  opacity: 0.5;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.descr {
  max-width: 28.5rem;
  @include mobile {
    max-width: none;
    width: 100%;
    order: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-s) var(--custom-ease-out);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  @include mobile {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 2rem;
  }
}
.item {
  height: 46.25rem;
  flex: 1 1 auto;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  @include mobile {
    height: auto;
  }
}

.item:nth-child(6n + 1),
.item:nth-child(6n + 4) {
  flex: 1 1 100%;
  @include mobile {
    flex: auto;
  }
}
.item:nth-child(6n + 2),
.item:nth-child(6n + 6) {
  flex: 0 0 35.8125rem;
  @include mobile {
    flex: auto;
  }
}
.item-photo {
  position: relative;
  height: 100%;
  transition: transform var(--dur-m) var(--custom-ease-out);
  @include mobile {
    height: 16rem;
  }
}

.filters {
  width: 43.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  @include mobile {
    width: 100%;
    flex-direction: column;
    gap: 0;
    align-items: flex-start;
    text-align: left;
  }
}
.filters:deep(.split-line-mask) {
  width: 100%;
}
.filters:deep(.split-line) {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  @include mobile {
    padding: 1rem 0 0;
    position: relative;
  }
}
.item-title {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 2rem;
  line-height: 100%;
  text-transform: uppercase;
  font-family: var(--f-medium);
  transform: translateY(-1rem);
  opacity: 0;
  transition:
    transform var(--dur-m) var(--custom-ease-out),
    opacity var(--dur-m) var(--custom-ease-out);
  @include mobile {
    opacity: 1;
    transform: none;
    gap: 0;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
.item-title:deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}
.title-arrow {
  @include mobile {
    display: none;
  }
}
.item-details {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  flex-wrap: wrapt;
}
.item-services,
.item-year,
.item-category {
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.3125rem);
  color: var(--c-white);
  transition:
    background-color var(--dur-m) var(--custom-ease-out),
    color var(--dur-m) var(--custom-ease-out);
}

.item-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  opacity: 0;
  transition: opacity var(--dur-m) var(--custom-ease-out);
}
.info-total {
  @include mobile {
    order: 2;
    margin-top: 3rem;
  }
}
.filter-slash {
  @include mobile {
    display: none;
  }
}
@include hover {
  .item:hover {
    .item-services,
    .item-year,
    .item-category {
      background-color: var(--c-white);
      color: var(--c-black);
    }

    .item-title {
      transform: translateY(0);
      opacity: 1;
    }

    .item-photo {
      transform: scale(1.05);
    }

    .item-gradient {
      opacity: 1;
    }
  }
}

.item-service,
.item-cat,
.year-text {
  @include mobile {
    opacity: 0.5;
  }
}
</style>
