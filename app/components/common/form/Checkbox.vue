<template>
  <label class="checkbox">
    <input
      type="checkbox"
      :name="name"
      :checked="model"
      :required="required"
      @change="onChange"
    />
    <span class="box" aria-hidden="true" />
    <span class="text p2">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  name?: string
  required?: boolean
}>()

const model = defineModel<boolean>({ default: false })

const onChange = (event: Event) => {
  model.value = (event.target as HTMLInputElement).checked
}
</script>

<style scoped lang="scss">
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

input {
  position: absolute;
  opacity: 0;
  width: 0.0625rem;
  height: 0.0625rem;
  pointer-events: none;
}

.box {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  border: 0.0625rem solid rgba(6, 6, 6, 0.3);
  position: relative;
}

.box:after {
  content: "";
  position: absolute;
  inset: 0.25rem;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

input:checked + .box:after {
  opacity: 1;
}
</style>
