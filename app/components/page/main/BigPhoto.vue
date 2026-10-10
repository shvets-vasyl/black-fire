<template>
  <section class="big-photo" data-anim-parallax>
    <img class="inner-media" draggable="false" src="/images/about.avif" />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.big-photo {
  height: 100vh;
  position: relative;
  display: none;
  @include mobile {
    display: block;
  }
}
</style>
