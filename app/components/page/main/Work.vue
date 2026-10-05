<template>
  <section id="work" ref="sectionRef" class="work">
    <div class="sticky">
      <div class="items">
        <div
          v-for="({ photo, title, descr, services, type, date }, i) in items"
          :key="i"
          class="item"
        >
          <img class="inner-media" :src="photo" :alt="title" />
          <div class="item-content">
            <div class="item-left">
              <h2 class="item-title h2">
                <div class="title-arrow">
                  <IconArrow2 />
                </div>
                <div class="title-text">{{ title }}</div>
              </h2>
              <div class="item-descr" v-html="descr" />
            </div>
            <div class="item-right">
              <div class="item-services p2">
                <p class="item-subtitle">Service</p>
                <p class="item-text">{{ services }}</p>
              </div>
              <div class="item-type p2">
                <p class="item-subtitle">Type</p>
                <p class="item-text">{{ type }}</p>
              </div>
              <div class="item-date p2">
                <p class="item-subtitle">Date</p>
                <p class="item-text">{{ date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="subtitle-wrap">
        <CommonSubtitle text="selected projects" />
      </div>

      <p class="count p2">{{ currentCount }} / {{ totalCount }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let ctx: ReturnType<typeof gsap.context> | null = null

onMounted(() => {
  const section = sectionRef.value
  if (!section) return

  const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".item"))
  if (cards.length < 2) return

  ctx = gsap.context(() => {
    cards.forEach((card, index) => {
      gsap.set(card, {
        zIndex: cards.length - index,
        transformOrigin: "center bottom",
      })
    })
    gsap.set(cards.slice(1), { scaleY: 0 })

    const steps = cards.length - 1

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const next = Math.min(steps, Math.round(self.progress * steps))
          if (activeIndex.value !== next) activeIndex.value = next
        },
      },
    })

    cards.forEach((card, index) => {
      const next = cards[index + 1]
      if (!next) return

      timeline
        .to(card, { yPercent: -100, ease: "none", duration: 1 }, index)
        .to(next, { scaleY: 1, ease: "none", duration: 1 }, index)
    })
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})

const items = [
  {
    photo: "/images/projects.webp",
    title: "Zinchenko",
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    services: "web development, marketing",
    type: "beauty",
    date: "2025",
  },
  {
    photo: "/images/projects.webp",
    title: "Zinchenko",
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    services: "web development, marketing",
    type: "beauty",
    date: "2025",
  },
  {
    photo: "/images/projects.webp",
    title: "Zinchenko",
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    services: "web development, marketing",
    type: "beauty",
    date: "2025",
  },
]

const padCount = (value: number) => String(value).padStart(2, "0")
const currentCount = computed(() => padCount(activeIndex.value + 1))
const totalCount = computed(() => padCount(items.length))
</script>

<style scoped lang="scss">
.work {
  height: 300vh;
}
.items {
  position: absolute;
  inset: 0;
}
.item {
  position: absolute;
  inset: 0;
  transform-origin: center bottom;

  &:not(:first-child) {
    transform: scaleY(0);
  }
}

.item-content {
  position: absolute;
  bottom: 0;
  left: 0%;
  width: 100%;
  padding: 0 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  @include mobile {
    padding: 0 1rem 2rem;
  }
}

.item-descr:deep(br) {
  @include mobile {
    display: none;
  }
}

.item-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  @include mobile {
    margin-bottom: 1.5rem;
    gap: 0.5rem;
  }
}
.item-right {
  flex: 0 0 35.8125rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  @include mobile {
    display: none;
  }
}
.item-subtitle {
  margin-bottom: 0.25rem;
  opacity: 0.5;
}

.subtitle-wrap,
.count {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  backdrop-filter: blur(0.25rem);
}

.subtitle-wrap {
  left: 1.5rem;
  @include mobile {
    left: 1rem;
  }
}
.count {
  right: 1.5rem;
  @include mobile {
    right: 1rem;
  }
}
</style>
