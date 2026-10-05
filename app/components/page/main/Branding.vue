<template>
  <section class="branding">
    <div class="content">
      <div data-anim-fade>
        <IconLogo />
      </div>

      <h3 class="title h3" data-anim-title>
        We don't just package your product. We give it a style that's recognisably its
        own.
      </h3>

      <div data-anim-fade>
        <CommonButtonTemplate text="let's talk" @click="openConnect" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { open: openConnect } = useConnectPopup()
</script>

<style scoped lang="scss">
.branding {
  padding: 14rem 0 10rem;
  display: flex;
  justify-content: center;
  @include mobile {
    padding: 10rem 1rem 7rem;
  }
}
.title {
  text-align: center;
}
.content {
  width: 45.4375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  @include mobile {
    width: 100%;
  }
}
</style>
