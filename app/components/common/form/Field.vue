<template>
  <div class="field" :class="{ 'has-error': !!error, focused, open, filled }">
    <label v-if="label" class="label" :for="htmlFor">{{ label }}</label>
    <slot />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  htmlFor?: string
  error?: string
  focused?: boolean
  open?: boolean
  filled?: boolean
}>()
</script>

<style scoped lang="scss">
.field {
  position: relative;
  width: 100%;
  border-bottom: 0.0625rem solid rgba(6, 6, 6, 0.3);
  padding-bottom: 0.625rem;
  transition: border-color var(--transition-fast);
}

.field.open {
  z-index: 2;
}

.field.focused,
.field.open {
  border-color: var(--c-black);
}

@include hover {
  .field:not(.has-error):hover {
    border-color: var(--c-black);
  }
}

.field.has-error {
  border-color: var(--c-red);
  color: var(--c-red);

  :deep(input),
  :deep(textarea),
  :deep(.trigger) {
    color: var(--c-red);
  }
}

.label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  line-height: 130%;
  letter-spacing: 0.02rem;
}

.error {
  margin-top: 0.3125rem;
  position: absolute;
  top: 100%;
  left: 0;
  color: var(--c-red);
  font-family: var(--f-medium);
  font-size: 0.75rem;
  line-height: 120%;
  text-transform: none;
}

:deep(input),
:deep(textarea),
:deep(.trigger) {
  display: block;
  width: 100%;
  color: var(--c-black);
  background: transparent;
  font-size: 0.875rem;
  font-family: var(--f-regular);
  line-height: 130%;
  letter-spacing: 0.02rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: rgba(6, 6, 6, 0.35);
}
</style>
