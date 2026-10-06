<template>
  <header
    class="header"
    data-header
    :class="{ 'is-black': isBlack, 'is-menu-open': isMenuOpen }"
  >
    <div class="header-blur" />

    <CommonLinkTemplate
      class="logo"
      text="black.fire"
      href="#hero"
      @click="onLogoClick"
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
      <CommonLinkTemplate
        text="let's talk"
        href="#"
        show-line
        @click.prevent="openConnect"
      >
        <IconPlus />
      </CommonLinkTemplate>
    </div>

    <button
      class="menu-btn"
      :class="{ 'is-open': isMenuOpen }"
      type="button"
      @click="toggleMenu"
    >
      <span v-if="isMenuOpen" class="menu-text p2">Close</span>
      <span v-else class="menu-text p2">Menu</span>
      <IconDots class="menu-icon" />
    </button>

    <div class="menu" :class="{ 'is-open': isMenuOpen }">
      <nav class="menu-nav" aria-label="Sections">
        <span v-for="(item, index) in nav" :key="item.id" class="nav-item">
          <CommonLinkTemplate
            :text="item.text"
            :href="`#${item.id}`"
            @click="onMenuSectionClick($event, item.id)"
          />
          <span v-if="index < nav.length - 1" class="nav-comma" aria-hidden="true"
            >,</span
          >
        </span>
      </nav>

      <div class="menu-info">
        <CommonSubtitle :text="cityTime" />
        <CommonLinkTemplate
          text="let's talk"
          href="#"
          show-line
          @click.prevent="onTalkClick"
        >
          <IconPlus />
        </CommonLinkTemplate>
      </div>
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
const { open: openConnect } = useConnectPopup()

const isMenuOpen = ref(false)

const cityTime = ref(formatCityTime(TIME_ZONE, CITY))
let timerId = 0

const updateCityTime = () => {
  cityTime.value = formatCityTime(TIME_ZONE, CITY)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  useLockScroll(isMenuOpen.value)
}

const closeMenu = () => {
  if (!isMenuOpen.value) return
  toggleMenu()
}

const onTalkClick = () => {
  closeMenu()
  openConnect()
}

const onLogoClick = (event: MouseEvent) => {
  closeMenu()
  onSectionClick(event, "hero")
}

const onMenuSectionClick = (event: MouseEvent, id: string) => {
  closeMenu()
  onSectionClick(event, id)
}

onMounted(() => {
  updateCityTime()
  timerId = window.setInterval(updateCityTime, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(timerId)
  if (isMenuOpen.value) useLockScroll(false)
})
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  color: var(--c-white);
  transition: color var(--dur-s) var(--custom-ease-out);

  @include mobile {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }
}
.header.is-black {
  color: var(--c-black);
}
.header.is-menu-open {
  color: var(--c-white);
}
.header-blur {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + 4rem);
  pointer-events: none;
  backdrop-filter: blur(1rem);
  mask-image: linear-gradient(to bottom, #000 0%, #000 40%, transparent 100%);
}
.logo,
.nav,
.info,
.menu-btn {
  position: relative;
  z-index: 2;
}
.logo {
  justify-self: start;
}
.nav {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  @include mobile {
    display: none;
  }
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
  @include mobile {
    display: none;
  }
}

.menu-btn {
  display: none;
  border: 0;
  padding: 0;
  background: none;
  color: inherit;
  font: inherit;

  @include mobile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
.menu-icon {
  transition: transform var(--dur-m) var(--custom-ease-in-out);
}
.menu-btn.is-open .menu-icon {
  transform: rotate(45deg);
}

.menu {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 6rem 1rem 1.5rem;
  background: var(--c-black);
  color: var(--c-white);
  pointer-events: none;
  transform: translateX(101%);
  will-change: transform;
  transition: transform var(--dur-m) var(--custom-ease-in-out);

  @include mobile {
    display: flex;
  }
}
.menu.is-open {
  transform: translateX(0%);
  pointer-events: auto;
}
.menu-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
.menu-nav :deep(.link-template),
.menu-nav .nav-comma {
  font-size: 2rem;
  line-height: 1;
  font-family: var(--f-medium);
}
.menu-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
