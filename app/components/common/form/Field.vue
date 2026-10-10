<template>
  <div class="field" :class="{ 'has-error': !!error, focused, open, filled }">
    <label v-if="label" class="label p2" :for="htmlFor">
      {{ labelBody }}<span v-if="labelMark" class="mark">{{ labelMark }}</span>
    </label>
    <slot />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  htmlFor?: string
  error?: string
  focused?: boolean
  open?: boolean
  filled?: boolean
}>()

const labelMark = computed(() => props.label?.match(/\*+$/)?.[0] ?? "")
const labelBody = computed(() => {
  if (!props.label) return ""
  if (!labelMark.value) return props.label
  return props.label.slice(0, -labelMark.value.length)
})
</script>

<style scoped lang="scss">
.field {
  position: relative;
  width: 100%;
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.75rem;
  transition: border-color var(--transition-fast);
}

.field.open {
  z-index: 2;
}

.field.has-error {
  border-color: var(--c-red);
}

.field {
  :deep(input),
  :deep(.trigger) {
    height: 1.1875rem;
  }
}

.label {
  display: block;
  margin-bottom: 0.75rem;
  line-height: 1rem;
}

.mark {
  color: var(--c-red);
  font-size: 1rem;
  line-height: 1;
}

.error {
  margin-top: 0.25rem;
  position: absolute;
  top: 100%;
  left: 0;
  color: var(--c-red);
  font-size: 0.625rem;
}

:deep(input),
:deep(textarea),
:deep(.trigger) {
  display: block;
  width: 100%;
  color: var(--c-black);
  background: transparent;
  font-size: 1rem;
  font-family: var(--f-medium);
  line-height: 1rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: rgba(0, 0, 0, 0.5);
}
</style>
