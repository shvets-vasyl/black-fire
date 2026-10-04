<template>
  <header class="header" data-header :class="{ 'is-black': isBlack }">
    <CommonLinkTemplate
      class="logo"
      text="black.fire"
      href="#hero"
      @click="onSectionClick($event, 'hero')"
    />

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

    <div class="info">
      <CommonSubtitle :text="cityTime" />
      <CommonLinkTemplate text="let's talk" href="#" external show-line>
        <IconPlus />
      </CommonLinkTemplate>
    </div>
  </header>
</template>

<script setup lang="ts">
import { formatCityTime } from "~/utils/time/formatCityTime"

const TIME_ZONE = "Europe/Riga"
const CITY = "riga"

const nav = [
  { id: "work", text: "Work" },
  { id: "services", text: "Services" },
  { id: "about", text: "About us" },
]

const isBlack = useState("header-is-black", () => false)
const { onSectionClick } = useScrollToSection()

const cityTime = ref(formatCityTime(TIME_ZONE, CITY))
let timerId = 0

const updateCityTime = () => {
  cityTime.value = formatCityTime(TIME_ZONE, CITY)
}

onMounted(() => {
  updateCityTime()
  timerId = window.setInterval(updateCityTime, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(timerId)
})
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  color: var(--c-white);
  transition: color var(--dur-s) var(--custom-ease-out);

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 4rem);
    pointer-events: none;
    backdrop-filter: blur(1rem);
    -webkit-backdrop-filter: blur(1rem);
    mask-image: linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%);
  }
}
.header.is-black {
  color: var(--c-black);
}
.logo {
  justify-self: start;
}
.nav {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}
.nav-item {
  display: inline-flex;
  align-items: baseline;
}
.info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
