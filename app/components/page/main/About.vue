<template>
  <section id="about" class="about">
    <div class="left">
      <CommonSubtitle text="about us" data-anim-text />

      <div class="items" data-anim-fade>
        <div v-for="({ number, text, photo }, i) in items" :key="i" class="item">
          <h2 class="item-number h2">{{ number }}</h2>
          <img v-if="i === 1" class="award-img" draggable="false" :src="photo" />
          <p class="item-text p2">{{ text }}</p>
        </div>
      </div>

      <h4 class="text h4" data-anim-title>
        <span class="space" />We're a crew that works hard, thinks sharp and keeps the
        vibe solid. No politics, no games. Just people who care, push and create. We talk
        straight, lift each other up and aim higher every time.
      </h4>
    </div>
    <div class="right" data-anim-parallax>
      <img class="inner-media" draggable="false" src="/images/photo.webp" />
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    number: "120+",
    text: "projects launched",
  },
  {
    number: " ",
    photo: "/images/award.webp",
    text: "awards won – x1",
  },
  {
    number: "6",
    text: "people on board",
  },
  {
    number: "7",
    text: "years in the market",
  },
]
</script>

<style scoped lang="scss">
.about {
  height: 100vh;
  display: grid;
  grid-template-columns: 50% 50%;
  @include mobile {
    display: flex;
    height: auto;
  }
}
.right {
  position: relative;
  @include mobile {
    display: none;
  }
}
.left {
  padding: 2rem 8.0625rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  @include mobile {
    padding: 2rem 1rem;
  }
}
.item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.items {
  display: grid;
  grid-template-columns: repeat(2, 13.0625rem);
  gap: 1.5rem;
  margin-top: 7rem;
  @include mobile {
    grid-template-columns: 1fr 1fr;
  }
}
.item-text {
  margin-top: 0.5rem;
}
.text {
  margin-top: auto;
  @include mobile {
    margin-top: 7rem;
  }
}
.space {
  width: 8.4375rem;
  display: inline-flex;
  @include mobile {
    width: 2.75rem;
  }
}
.award-img {
  width: 6rem;
  transform: rotate(15deg);
  position: absolute;
  bottom: 2rem;
  @include mobile {
    width: 4.5rem;
    bottom: 1.5rem;
  }
}
.item:nth-child(odd) {
  border-right: 0.0625rem solid rgba(255, 255, 255, 0.1);
}
</style>
