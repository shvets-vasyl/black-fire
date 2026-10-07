<template>
  <component
    :is="tag"
    class="link-template p2"
    :class="{ 'is-lined': showLine, 'is-active': active }"
    v-bind="linkAttrs"
  >
    <span class="link-text">{{ text }}</span>
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  href?: string
  showLine?: boolean
  active?: boolean
  external?: boolean
}>()

const tag = computed(() => (props.href ? "a" : "span"))

const linkAttrs = computed(() => {
  if (!props.href) return {}

  if (!props.external) {
    return {
      href: props.href,
      "aria-current": props.active ? "true" : undefined,
    }
  }

  return {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer",
  }
})
</script>

<style scoped lang="scss">
.link-template {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.link-text {
  position: relative;
}
.link-text:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.0625rem;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform 0.4s var(--custom-ease-out);
}
.link-template.is-lined .link-text:after,
.link-template.is-active .link-text:after {
  transform: scaleX(1);
  transform-origin: left center;
}
@include hover {
  .link-template:hover .link-text:after {
    transform: scaleX(1);
    transform-origin: left center;
  }
  .link-template.is-lined:hover .link-text:after {
    transform: scaleX(0);
    transform-origin: right center;
  }
  .link-template.is-active:hover .link-text:after {
    transform: scaleX(1);
    transform-origin: left center;
  }
}
</style>
