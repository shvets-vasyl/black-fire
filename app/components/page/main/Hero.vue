<template>
  <section id="hero" class="hero" data-anim-parallax="10">
    <img class="inner-media" src="/images/hero.webp" alt="" />

    <div class="content">
      <p ref="title1El" class="title-1">black</p>
      <p ref="descrEl" class="descr p1">
        Marketing, film and web — <br />made by one team, in one voice.
      </p>
      <p ref="title2El" class="title-2">fire</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { animateTextDefault, animateTitleDefault } from "~/utils/animations"

const title1El = ref<HTMLElement | null>(null)
const title2El = ref<HTMLElement | null>(null)
const descrEl = ref<HTMLElement | null>(null)

let intros: gsap.core.Animation[] = []
let pendingPlay = false

const initIntro = () => {
  intros = []

  if (title1El.value) {
    intros.push(animateTitleDefault(title1El.value, { type: "enter" }).pause(0))
  }

  if (title2El.value) {
    intros.push(animateTitleDefault(title2El.value, { type: "enter" }).pause(0))
  }

  if (descrEl.value) {
    intros.push(animateTextDefault(descrEl.value, { type: "enter" }).pause(0))
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

onMounted(async () => {
  await document.fonts.ready
  initIntro()
})

useAfterTransition(() => {
  playIntro()
})

onBeforeUnmount(() => {
  intros.forEach((animation) => animation.kill())
})
</script>

<style scoped lang="scss">
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.content {
  padding: 0 1.5rem 1rem;
  position: relative;
  display: flex;
  width: 100%;
  gap: 1rem;
  @include mobile {
    padding: 0 1rem 1rem;
    flex-direction: column;
  }
}
.descr {
  flex: 1 1 auto;
  margin-top: 1.75rem;
  @include mobile {
    margin-top: 0;
    order: 1;
  }
}
.title-1,
.title-2 {
  font-family: var(--f-medium);
  font-size: 12rem;
  text-transform: uppercase;
  line-height: 100%;
  @include mobile {
    font-size: 5.325rem;
  }
}
.title-1 {
  @include mobile {
    order: 2;
    margin-left: -0.25rem;
  }
}
.title-2 {
  @include mobile {
    order: 3;
    text-align: right;
    margin-top: -1.35rem;
  }
}
</style>
