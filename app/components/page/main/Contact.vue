<template>
  <section class="contact">
    <div class="circle-wrap">
      <IconCircle />
    </div>

    <p class="subtitle" data-anim-text>
      Your site, ads and your videos come from people who talk to each other daily — so it
      all looks like one brand.
    </p>

    <div class="services" data-anim-fade>
      <p v-for="(service, i) in services" :key="i" class="service p2">{{ service }}</p>
    </div>

    <h1 class="title h1" data-anim-title>Have a project in mind?</h1>

    <CommonButtonTemplate data-anim-fade text="Let's spark it" />

    <footer class="footer">
      <p class="copy p2">© {{ new Date().getFullYear() }} black.fire WORLD WIDE, INC.</p>

      <nav class="nav" aria-label="Sections">
        <span v-for="(item, index) in nav" :key="item.id" class="nav-item">
          <CommonLinkTemplate
            :text="item.text"
            :href="`#${item.id}`"
            @click="onSectionClick($event, item.id)"
          />
          <span v-if="index < nav.length - 1" class="nav-comma p2" aria-hidden="true"
            >,</span
          >
        </span>
      </nav>

      <div class="socials">
        <span v-for="(item, index) in socials" :key="index" class="socials-item">
          <CommonLinkTemplate :text="item.text" :href="item.link" external />
          <span
            v-if="index < socials.length - 1"
            class="socials-comma p2"
            aria-hidden="true"
            >,</span
          >
        </span>
      </div>

      <CommonLinkTemplate
        class="mail"
        text="sayhi@black-fire.work"
        href="mailto:sayhi@black-fire.work"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
const { onSectionClick } = useScrollToSection()

const services = ["Branding", "NFT", "Websites", "Applications"]
const nav = [
  { id: "work", text: "Work" },
  { id: "services", text: "Services" },
  { id: "about", text: "About us" },
]
const socials = [
  { link: "https://t.me/porohdima", text: "tELEGRAM" },
  { link: "https://www.instagram.com/", text: "iNSTAGRAM" },
]
</script>

<style scoped lang="scss">
.contact {
  padding: 3rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.circle-wrap {
  position: absolute;
  bottom: 0;
  right: 0;
}
.subtitle {
  width: 28.5rem;
  margin-bottom: 10.25rem;
}
.services {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.service {
  opacity: 0.5;
  position: relative;
}
.service:not(:last-child) {
  padding-right: 1rem;
}
.service:not(:last-child):after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  width: 0.25rem;
  height: 0.25rem;
  background-color: currentColor;
}
.title {
  width: 49.8125rem;
  margin-bottom: 2.5rem;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}
.socials {
  display: flex;
  gap: 1rem;
}
.footer {
  display: flex;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
  margin-top: 14rem;
}
</style>
