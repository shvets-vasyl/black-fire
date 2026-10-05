<template>
  <CommonFormField
    :error="error"
    :focused="focused"
    :filled="!!model"
    :label="label"
    :html-for="inputId"
  >
    <textarea
      :id="inputId"
      :value="model"
      :name="name"
      :placeholder="placeholder"
      :rows="rows"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      :required="required"
      @input="onInput"
      @focus="focused = true"
      @blur="onBlur"
    />
  </CommonFormField>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    name: string
    rows?: number
    error: string
    required?: boolean
  }>(),
  { rows: 4 }
)

const emit = defineEmits<{
  blur: []
}>()

const model = defineModel<string>({ default: "" })
const focused = ref(false)
const uid = useId()
const inputId = computed(() => `field-${uid}`)
const errorId = computed(() => `error-${uid}`)

const onInput = (event: Event) => {
  model.value = (event.target as HTMLTextAreaElement).value
}

const onBlur = () => {
  focused.value = false
  emit("blur")
}
</script>

<style scoped lang="scss">
textarea {
  min-height: 5rem;
  display: block;
}
</style>
