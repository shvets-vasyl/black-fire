<template>
  <section class="hero">
    <div class="head">
      <h3 class="filters h3">
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

    <div class="info">
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
      <div v-for="item in visibleItems" :key="item.name" class="item">
        <div class="item-photo">
          <img
            class="inner-media"
            draggable="false"
            :src="item.photo"
            loading="lazy"
            :alt="item.name"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
const itemsEl = ref<HTMLElement | null>(null)

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

onBeforeUnmount(() => {
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
  padding: 0 1.5rem 6rem;
  @include mobile {
    padding: 0 1rem 4rem;
  }
}
.head {
  padding: 12.5rem 0 10rem;
  display: flex;
  justify-content: center;
  @include mobile {
    padding-top: 8rem;
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
}
.item {
  height: 46.25rem;
  flex: 1 1 auto;
}
.item:nth-child(6n + 1),
.item:nth-child(6n + 4) {
  flex: 1 1 100%;
}
.item:nth-child(6n + 2),
.item:nth-child(6n + 6) {
  flex: 0 0 35.8125rem;
}
.item-photo {
  position: relative;
  height: 100%;
}

.filters {
  width: 43.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}
</style>
