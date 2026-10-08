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
            <p v-if="name" class="item-name p1">{{ name }}</p>
            <p class="item-position p1" :class="{ 'is-only': !name }">{{ position }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const items = [
  {
    text: "BlackFire handles any task, from targeted advertising to website development. Whenever I need strong designers or marketers, they're the team I turn to. Everything is delivered on time and at the highest level.",
    name: "Liubov Dziuzhynska",
    position: "CEO @ DogaDoga",
    photo: "/images/dogga.jpg",
  },
  {
    text: "BlackFire designed our internal CRM, created the motion design and took part in developing the Trady platform. I liked their approach and how well the team is organized internally. What I valued most was their help with things studios usually don't do, like legal matters.",
    name: "",
    position: "CEO @ Trady",
    photo: "/images/trady.jpg",
  },
  {
    text: "When we started working on the NFT collection, I didn't believe it could be done in a month. What impressed me most was how quickly I received progress updates. We could change direction on the fly, and the team adapted to my requests right away. I'm very happy with our collaboration.",
    name: "",
    position: "Founder @ American Heroes",
    photo: "/images/heroes.jpg",
  },
]
</script>

<style scoped lang="scss">
.testimonials {
  padding-bottom: 14rem;
  @include mobile {
    padding-bottom: 10rem;
  }
}
.head {
  padding: 0 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @include mobile {
    padding: 0 1rem 4rem;
  }
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
  @include mobile {
    padding-top: 3rem;
  }
}
.item-name,
.item-position {
  line-height: 1.25rem;
}
.item-position {
  opacity: 0.5;
  &.is-only {
    opacity: 1;
  }
}
.items {
  display: flex;
  @include mobile {
    flex-direction: column;
    padding: 0 1rem;
  }
}
.item-text {
  margin-top: 1rem;
}
.item {
  flex: 0 0 33.33%;
  display: flex;
  flex-direction: column;
  padding: 0 2rem 0 1.5rem;
  @include mobile {
    flex: none;
    padding: 0;
    padding-bottom: 1.5rem;
  }
}
.item:not(:last-child) {
  border-right: 0.0625rem solid rgba(0, 0, 0, 0.1);
  @include mobile {
    border-right: none;
    border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }
}
</style>
