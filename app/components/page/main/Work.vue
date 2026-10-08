<template>
  <section
    id="work"
    ref="sectionRef"
    class="work"
    :style="{ height: `${Math.max(items.length, 1) * 100}vh` }"
  >
    <div class="sticky">
      <div class="items">
        <div v-for="(item, i) in items" :key="i" class="item">
          <img class="inner-media" :src="item.photo" :alt="item.title" />
          <div class="item-content">
            <div class="item-left">
              <h2 class="item-title h2">
                <div class="title-arrow">
                  <IconArrow2 />
                </div>
                <div class="title-text">{{ item.title }}</div>
              </h2>
              <div class="item-descr" v-html="item.descr" />
            </div>
            <div class="item-right">
              <div class="item-services p2">
                <p class="item-subtitle">Service</p>
                <p class="item-text">{{ item.services }}</p>
              </div>
              <div class="item-type p2">
                <p class="item-subtitle">Type</p>
                <p class="item-text">{{ item.type }}</p>
              </div>
              <div class="item-date p2">
                <p class="item-subtitle">Date</p>
                <p class="item-text">{{ item.date }}</p>
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
import { transitionDurations } from "~/utils/gsap-autoimport"

const HIDDEN = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
const SHOWN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

const sectionRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let ctx: ReturnType<typeof gsap.context> | null = null

useAfterTransition(() => {
  const section = sectionRef.value
  if (!section) return

  const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll(".item"))
  if (cards.length < 2) return

  ctx = gsap.context(() => {
    const contents = cards.map((card) => card.querySelector(".item-content"))

    cards.forEach((card, index) => gsap.set(card, { zIndex: index }))
    gsap.set(cards.slice(1), { clipPath: HIDDEN })
    gsap.set(contents.slice(1), { autoAlpha: 0 })
    gsap.set(
      cards.map((card) => card.querySelector("img")),
      { yPercent: 8 }
    )

    const steps = cards.length - 1

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const next = Math.min(steps, Math.round(self.progress * steps))
          if (activeIndex.value === next) return

          activeIndex.value = next
          const content = contents[next]
          if (!content) return

          gsap.to(content, {
            autoAlpha: 1,
            duration: transitionDurations.durS,
            ease: "custom.out",
          })
        },
      },
    })

    cards.forEach((card, index) => {
      const next = cards[index + 1]
      const start = Math.max(0, index - 1)
      const end = Math.min(steps, index + 1)

      if (next) timeline.to(next, { clipPath: SHOWN, ease: "none", duration: 1 }, index)

      timeline.fromTo(
        card.querySelector("img"),
        { yPercent: 8 },
        { yPercent: -8, ease: "none", duration: end - start, immediateRender: false },
        start
      )
    })
  }, section)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
const { data } = await useProjects()
const items = computed(() =>
  (data.value ?? []).slice(0, 3).map((item) => ({
    photo: item.photos[0] ?? "",
    title: item.name,
    descr: item.descr,
    services: item.services.join(", "),
    type: item.category.join(", "),
    date: item.year,
  }))
)

const padCount = (value: number) => String(value).padStart(2, "0")
const currentCount = computed(() => padCount(activeIndex.value + 1))
const totalCount = computed(() => padCount(items.value.length))
</script>

<style scoped lang="scss">
.items {
  position: absolute;
  inset: 0;
}
.item {
  position: absolute;
  inset: 0;

  &:not(:first-child) {
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }
}
.item .inner-media {
  top: -12%;
  height: 124%;
}
.item:not(:first-child) .item-content {
  opacity: 0;
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

.item-descr:deep(p) {
  margin: 0;
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
