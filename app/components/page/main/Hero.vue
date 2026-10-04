<template>
  <section id="hero" class="hero" data-anim-parallax="10" data-anim-parallax-scale="1.16">
    <img class="inner-media" src="/images/hero.webp" alt="" />

    <div class="content">
      <p class="title-1" data-intro-title>black</p>
      <p class="descr p1" data-intro-text>
        Marketing, film and web — <br />made by one team, in one voice.
      </p>
      <p class="title-2" data-intro-title>fire</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
}
.descr {
  flex: 1 1 auto;
  margin-top: 1.75rem;
}
.title-1,
.title-2 {
  font-family: var(--f-medium);
  font-size: 12rem;
  text-transform: uppercase;
  line-height: 100%;
}
</style>
