<template>
  <component
    :is="tag"
    class="btn-template"
    :class="{ 'is-black': black, 'is-grey': grey }"
    v-bind="controlAttrs"
  >
    <span class="btn-track">
      <span class="btn-arrow">
        <IconArrow />
      </span>
      <span class="btn-text p2">{{ text }}</span>
      <span class="btn-arrow" aria-hidden="true">
        <IconArrow />
      </span>
    </span>
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  href?: string
  external?: boolean
  black?: boolean
  grey?: boolean
  submit?: boolean
}>()

const tag = computed(() => (props.href ? "a" : "button"))

const controlAttrs = computed(() => {
  if (!props.href) return { type: props.submit ? "submit" : "button" }

  if (!props.external) return { href: props.href }

  return {
    href: props.href,
    target: "_blank",
    rel: "noopener noreferrer",
  }
})
</script>

<style scoped lang="scss">
.btn-template {
  display: inline-flex;
  height: 2.5rem;
  overflow: hidden;
  color: var(--c-black);
}
.btn-track {
  display: flex;
  height: 100%;
  gap: 0.125rem;
  margin-right: calc(-2.5rem - 0.125rem);
  transition: transform 0.5s var(--custom-ease-out);
}
.btn-arrow,
.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  background-color: var(--c-white);
}
.btn-arrow {
  width: 2.5rem;
}
.btn-text {
  padding: 0 1rem;
  font-family: var(--f-medium);
}
.btn-template.is-black {
  color: var(--c-white);
}
.btn-template.is-black .btn-arrow,
.btn-template.is-black .btn-text {
  background-color: var(--c-black);
}

.btn-template.is-grey .btn-arrow,
.btn-template.is-grey .btn-text {
  background-color: rgba(0, 0, 0, 0.05);
}
@include hover {
  .btn-template:hover .btn-track {
    transform: translateX(calc(-2.5rem - 0.125rem));
  }
}
</style>
