<template>
  <section class="contact">
    <div class="circle-wrap" />

    <p v-if="!hideSubtitle" class="subtitle" data-anim-text>
      Your site, ads and your videos come from people who talk to each other daily — so it
      all looks like one brand.
    </p>

    <div class="services" data-anim-fade>
      <div
        v-for="copy in 2"
        :key="copy"
        class="services-track"
        :aria-hidden="copy > 1 || undefined"
      >
        <p
          v-for="(service, i) in tickerServices"
          :key="`${copy}-${i}`"
          class="service p2"
          :aria-hidden="copy > 1 || i >= services.length || undefined"
        >
          {{ service }}
        </p>
      </div>
    </div>

    <h1 class="title h1" data-anim-title>Have a project in mind?</h1>

    <CommonButtonTemplate data-anim-fade text="Let's spark it" @click="openConnect" />

    <footer class="footer">
      <p class="copy p2">© {{ new Date().getFullYear() }} black.fire WORLD WIDE, INC.</p>

      <nav class="nav" aria-label="Sections">
        <span v-for="(item, index) in nav" :key="item.id" class="nav-item">
          <CommonLinkTemplate
            :text="item.text"
            :href="item.href"
            :active="activeId === item.id"
            @click="openNav($event, item.id)"
          />
          <span v-if="index < nav.length - 1" class="nav-comma p2" aria-hidden="true"
            >,</span
          >
        </span>
      </nav>

      <div class="socials">
        <span v-for="(item, index) in socials" :key="index" class="socials-item">
          <CommonLinkTemplate :text="item.text" :href="item.link" external />
          <span class="socials-comma p2" aria-hidden="true">,</span>
        </span>

        <span class="policy-mob">
          <CommonLinkTemplate
            text="Privacy Policy"
            href="/policy"
            :active="isPolicy"
            @click="openPolicy"
          />
          <span class="socials-comma p2" aria-hidden="true">,</span>
        </span>

        <CommonLinkTemplate
          class="mail-mob"
          text="sayhi@blackfire.studio"
          href="mailto:sayhi@blackfire.studio"
        />
      </div>

      <div class="mail-group">
        <span class="mail-item">
          <CommonLinkTemplate
            text="Privacy Policy"
            href="/policy"
            :active="isPolicy"
            @click="openPolicy"
          />
          <span class="p2" aria-hidden="true">,</span>
        </span>

        <CommonLinkTemplate
          text="sayhi@blackfire.studio"
          href="mailto:sayhi@blackfire.studio"
        />
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  hideSubtitle?: boolean
}>()

const { nav, activeId, openNav } = useSiteNav()
const { open: openConnect } = useConnectPopup()
const route = useRoute()
const router = useRouter()

const isPolicy = computed(() => route.path === "/policy")

const openPolicy = (event: MouseEvent) => {
  event.preventDefault()
  if (route.path !== "/policy") void router.push("/policy")
}

const services = ["Branding", "NFT", "Websites", "Applications"]
const tickerServices = Array.from({ length: 8 }, () => services).flat()
const socials = [
  { link: "https://t.me/blackfire_commercial", text: "tELEGRAM" },
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
  @include mobile {
    padding: 2rem 1rem;
  }
}
.circle-wrap {
  width: 90rem;
  height: 90rem;
  position: absolute;
  border-radius: 100%;
  background: #f00;
  filter: blur(15.625rem);
  right: -32.875rem;
  top: 100%;
  margin-top: -18.75rem;
  animation: circle-drift 18s linear infinite;
  @include mobile {
    right: auto;
    left: 0;
    margin-top: -25rem;
    animation: none;
  }
}
@keyframes circle-drift {
  0%,
  100% {
    transform: translate3d(0rem, 0rem, 0) scale(1, 1);
  }
  2.5% {
    transform: translate3d(-0.16rem, 0.11rem, 0) scale(1, 1.01);
  }
  5% {
    transform: translate3d(-0.62rem, 1.24rem, 0) scale(0.99, 1.03);
  }
  7.5% {
    transform: translate3d(-1.41rem, 5rem, 0) scale(0.98, 1.08);
  }
  10% {
    transform: translate3d(-2.54rem, 11.6rem, 0) scale(0.98, 1.08);
  }
  12.5% {
    transform: translate3d(-4.11rem, 16.63rem, 0) scale(1.01, 1.03);
  }
  15% {
    transform: translate3d(-6.29rem, 16.94rem, 0) scale(1.05, 0.99);
  }
  17.5% {
    transform: translate3d(-9.29rem, 17.13rem, 0) scale(1.06, 0.98);
  }
  20% {
    transform: translate3d(-13.33rem, 17.12rem, 0) scale(1.08, 0.97);
  }
  22.5% {
    transform: translate3d(-18.49rem, 16.86rem, 0) scale(1.1, 0.97);
  }
  25% {
    transform: translate3d(-24.66rem, 16.38rem, 0) scale(1.12, 0.97);
  }
  27.5% {
    transform: translate3d(-31.48rem, 15.74rem, 0) scale(1.12, 0.97);
  }
  30% {
    transform: translate3d(-38.42rem, 15.07rem, 0) scale(1.12, 0.97);
  }
  32.5% {
    transform: translate3d(-44.9rem, 14.5rem, 0) scale(1.11, 0.97);
  }
  35% {
    transform: translate3d(-50.49rem, 14.15rem, 0) scale(1.09, 0.97);
  }
  37.5% {
    transform: translate3d(-54.98rem, 14.05rem, 0) scale(1.07, 0.97);
  }
  40% {
    transform: translate3d(-58.37rem, 14.17rem, 0) scale(1.05, 0.98);
  }
  42.5% {
    transform: translate3d(-60.85rem, 14.43rem, 0) scale(1.03, 1);
  }
  45% {
    transform: translate3d(-62.64rem, 12.76rem, 0) scale(1, 1.05);
  }
  47.5% {
    transform: translate3d(-63.94rem, 6.76rem, 0) scale(0.98, 1.08);
  }
  50% {
    transform: translate3d(-64.85rem, 2.12rem, 0) scale(0.99, 1.05);
  }
  52.5% {
    transform: translate3d(-65.44rem, 0.31rem, 0) scale(1, 1.01);
  }
  55% {
    transform: translate3d(-65.72rem, 0.13rem, 0) scale(1, 1);
  }
  57.5% {
    transform: translate3d(-65.49rem, 0.31rem, 0) scale(1.01, 1.01);
  }
  60% {
    transform: translate3d(-63.89rem, 1.83rem, 0) scale(1.01, 1.04);
  }
  62.5% {
    transform: translate3d(-60.9rem, 7.89rem, 0) scale(1.01, 1.09);
  }
  65% {
    transform: translate3d(-56.73rem, 16.54rem, 0) scale(1.05, 1.04);
  }
  67.5% {
    transform: translate3d(-51.74rem, 17.24rem, 0) scale(1.09, 0.97);
  }
  70% {
    transform: translate3d(-46.48rem, 16.49rem, 0) scale(1.09, 0.98);
  }
  72.5% {
    transform: translate3d(-41.54rem, 15.75rem, 0) scale(1.08, 0.98);
  }
  75% {
    transform: translate3d(-37.26rem, 15.27rem, 0) scale(1.07, 0.98);
  }
  77.5% {
    transform: translate3d(-33.58rem, 15.26rem, 0) scale(1.06, 0.98);
  }
  80% {
    transform: translate3d(-30.01rem, 15.74rem, 0) scale(1.06, 0.99);
  }
  82.5% {
    transform: translate3d(-26.01rem, 16.55rem, 0) scale(1.07, 0.98);
  }
  85% {
    transform: translate3d(-21.31rem, 17.41rem, 0) scale(1.09, 0.98);
  }
  87.5% {
    transform: translate3d(-16.11rem, 18.08rem, 0) scale(1.09, 0.97);
  }
  90% {
    transform: translate3d(-10.95rem, 18.47rem, 0) scale(1.06, 1.02);
  }
  92.5% {
    transform: translate3d(-6.39rem, 11.7rem, 0) scale(1.01, 1.09);
  }
  95% {
    transform: translate3d(-2.9rem, 3.28rem, 0) scale(1.01, 1.07);
  }
  97.5% {
    transform: translate3d(-0.73rem, 0.27rem, 0) scale(1.01, 1.02);
  }
}
@media (prefers-reduced-motion: reduce) {
  .circle-wrap {
    animation: none;
  }
}
.subtitle {
  width: 28.5rem;
  @include mobile {
    width: 100%;
  }
}
.services {
  display: flex;
  width: 21rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  margin-top: 10.25rem;
}
.services-track {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  @include ticker(36s);
}
.service {
  opacity: 0.5;
  position: relative;
  padding-right: 1rem;
  margin-right: 0.75rem;
  white-space: nowrap;
}
.service:after {
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
  @include mobile {
    width: 100%;
  }
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  @include mobile {
    order: 1;
  }
}
.socials {
  display: flex;
  gap: 1rem;
  @include mobile {
    order: 2;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
  }
}
.socials-item:last-child .socials-comma {
  display: none;
  @include mobile {
    display: inline;
  }
}
.footer {
  display: flex;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
  margin-top: 14rem;
  z-index: 2;
  @include mobile {
    margin-top: 10.875rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.75rem;
    row-gap: 4rem;
  }
}
.mail-mob,
.policy-mob {
  display: none;
  @include mobile {
    display: inline-flex;
  }
}
.policy-mob {
  align-items: baseline;
}
.mail-group {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  @include mobile {
    display: none;
  }
}
.mail-item {
  display: inline-flex;
  align-items: baseline;
}
.copy {
  @include mobile {
    order: 3;
    grid-column: 1 / span 2;
    text-align: left;
  }
}
</style>
