<template>
  <section class="testimonials">
    <div class="head">
      <CommonSubtitle text="testimonials" data-anim-text />
      <h2 class="title h2" data-anim-title>trust us</h2>
    </div>

    <div class="items" data-anim-fade>
      <div v-for="({ text, name, position, photo }, i) in items" :key="i" class="item">
        <IconQuote />

        <h5 class="item-text h5">{{ text }}</h5>

        <div class="item-person">
          <div class="person-photo">
            <img class="inner-media" draggable="false" :src="photo" :alt="name" />
          </div>
          <div class="person-info">
            <p class="item-name p1">{{ name }}</p>
            <p class="item-position p1">{{ position }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    text: "Having collaborated with Alex on multiple projects, I have consistently witnessed his unwavering commitment to collaboration, delivering top-notch results with remarkable efficiency. ",
    name: "Mauro Coelho",
    position: "Co-founder @ Team MHD",
    photo: "/images/review.webp",
  },
  {
    text: "The way the team captured the essence of the Giverr brand and translated it into a cohesive and functional design was particularly impressive.",
    position: "Co-founder @ Team MHD",
    photo: "/images/review.webp",
  },
  {
    text: "Working with Alex was great. He helped me start running my business on social media by enhancing my stories, improving images, and creating a much more professional appearance. ",
    name: "Mauro Coelho",
    position: "Co-founder @ Team MHD",
    photo: "/images/review.webp",
  },
]
</script>

<style scoped lang="scss">
.testimonials {
  padding-bottom: 14rem;
}
.head {
  padding: 0 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.person-photo {
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  position: relative;
  border-radius: 0.5rem;
}
.item-person {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 6rem;
}
.item-name,
.item-position {
  line-height: 1.25rem;
}
.item-position {
  opacity: 0.5;
}
.items {
  display: flex;
}
.item-text {
  margin-top: 1rem;
}
.item {
  display: flex;
  flex-direction: column;
  padding: 0 2rem 0 1.5rem;
}
.item:not(:last-child) {
  border-right: 0.0625rem solid rgba(0, 0, 0, 0.1);
}
</style>
