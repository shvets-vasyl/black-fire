<template>
  <CommonFormField
    :error="error"
    :focused="focused"
    :filled="!!model"
    :label="label"
    :html-for="inputId"
  >
    <input
      :id="inputId"
      :value="model"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      :required="required"
      @keydown="onKeydown"
      @paste="onPaste"
      @input="onInput"
      @focus="focused = true"
      @blur="onBlur"
    />
  </CommonFormField>
</template>

<script setup lang="ts">
type InputMode =
  "text" | "search" | "none" | "email" | "tel" | "numeric" | "url" | "decimal"

const props = defineProps<{
  label?: string
  placeholder?: string
  name?: string
  type?: string
  autocomplete?: string
  inputmode?: InputMode
  error?: string
  digitsOnly?: boolean
  required?: boolean
}>()

const emit = defineEmits<{
  blur: []
}>()

const model = defineModel<string>({ default: "" })
const focused = ref(false)
const uid = useId()
const inputId = computed(() => `field-${uid}`)
const errorId = computed(() => `error-${uid}`)

const toDigits = (value: string) => value.replace(/\D/g, "")

const onKeydown = (event: KeyboardEvent) => {
  if (!props.digitsOnly) return
  if (event.metaKey || event.ctrlKey || event.altKey) return

  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ]
  if (allowed.includes(event.key)) return
  if (!/^\d$/.test(event.key)) event.preventDefault()
}

const onPaste = (event: ClipboardEvent) => {
  if (!props.digitsOnly) return
  event.preventDefault()
  const digits = toDigits(event.clipboardData?.getData("text") ?? "")
  const el = event.target as HTMLInputElement
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  const next = `${el.value.slice(0, start)}${digits}${el.value.slice(end)}`
  el.value = next
  model.value = next
}

const onInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  const next = props.digitsOnly ? toDigits(el.value) : el.value
  if (props.digitsOnly && el.value !== next) el.value = next
  model.value = next
}

const onBlur = () => {
  focused.value = false
  emit("blur")
}
</script>
