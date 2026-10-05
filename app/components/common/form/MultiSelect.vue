<template>
  <CommonFormField
    :error="error"
    :open="isOpen"
    :focused="focused"
    :filled="model.length > 0"
    :label="label"
    :html-for="triggerId"
  >
    <input type="hidden" :name="name" :value="model.join(', ')" />

    <div
      :id="triggerId"
      class="trigger"
      role="combobox"
      tabindex="0"
      :class="{ open: isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :aria-describedby="error ? errorId : undefined"
      :aria-required="required || undefined"
      @click="toggle"
      @keydown="onTriggerKeydown"
      @focus="focused = true"
      @blur="onTriggerBlur"
    >
      <span v-if="!selectedOptions.length" class="value is-placeholder">{{
        placeholder
      }}</span>
      <span v-else class="tags">
        <span v-for="option in selectedOptions" :key="option.value" class="tag">
          <span>{{ option.label }}</span>
          <button
            class="tag-remove"
            type="button"
            :aria-label="`Remove ${option.label}`"
            @mousedown.stop.prevent
            @click.stop="remove(option.value)"
          >
            <IconPlus />
          </button>
        </span>
      </span>
      <IconCaret class="caret" />
    </div>

    <ul
      v-if="isOpen"
      :id="listId"
      ref="listRef"
      class="dropdown"
      role="listbox"
      aria-multiselectable="true"
      data-lenis-prevent
      :aria-labelledby="triggerId"
      tabindex="-1"
      @keydown="onListKeydown"
      @wheel="onWheel"
    >
      <li
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="option.value"
        class="option"
        role="option"
        :aria-selected="model.includes(option.value)"
        :class="{
          active: index === activeIndex,
          selected: model.includes(option.value),
        }"
        @mousedown.prevent="toggleValue(option.value)"
      >
        <span>{{ option.label }}</span>
      </li>
    </ul>
  </CommonFormField>
</template>

<script setup lang="ts">
import type { FormSelectOption } from "./Select.vue"

const props = defineProps<{
  label?: string
  placeholder?: string
  options: FormSelectOption[]
  name?: string
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  blur: []
}>()

const model = defineModel<string[]>({ default: () => [] })
const isOpen = ref(false)
const focused = ref(false)
const activeIndex = ref(-1)
const listRef = ref<HTMLElement | null>(null)
const uid = useId()
const triggerId = computed(() => `select-${uid}`)
const listId = computed(() => `list-${uid}`)
const errorId = computed(() => `error-${uid}`)

const selectedOptions = computed(() =>
  model.value
    .map((value) => props.options.find((option) => option.value === value))
    .filter((option): option is FormSelectOption => !!option)
)

const optionId = (index: number) => `option-${uid}-${index}`

const open = (fromKeyboard = false) => {
  if (isOpen.value) return
  isOpen.value = true
  activeIndex.value = fromKeyboard ? 0 : -1
  nextTick(() => {
    listRef.value?.focus()
    scrollActiveIntoView()
  })
}

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  activeIndex.value = -1
  emit("blur")
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const toggleValue = (value: string) => {
  model.value = model.value.includes(value)
    ? model.value.filter((item) => item !== value)
    : [...model.value, value]
}

const remove = (value: string) => {
  model.value = model.value.filter((item) => item !== value)
}

const move = (step: number) => {
  const count = props.options.length
  if (!count) return
  activeIndex.value = (activeIndex.value + step + count) % count
  scrollActiveIntoView()
}

const scrollActiveIntoView = () => {
  const list = listRef.value
  const option = list?.children[activeIndex.value] as HTMLElement | undefined
  if (!list || !option) return

  const optionTop = option.offsetTop
  const optionBottom = optionTop + option.offsetHeight
  if (optionTop < list.scrollTop) list.scrollTop = optionTop
  else if (optionBottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = optionBottom - list.clientHeight
  }
}

const onWheel = (event: WheelEvent) => {
  event.stopPropagation()
  const el = event.currentTarget as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = el
  const atTop = scrollTop <= 0 && event.deltaY < 0
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && event.deltaY > 0
  if (atTop || atBottom) event.preventDefault()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    open(true)
  }
}

const onListKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    event.preventDefault()
    close()
    return
  }

  if (event.key === "ArrowDown") {
    event.preventDefault()
    move(1)
    return
  }

  if (event.key === "ArrowUp") {
    event.preventDefault()
    move(-1)
    return
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    const option = props.options[activeIndex.value]
    if (option) toggleValue(option.value)
  }
}

const onTriggerBlur = () => {
  focused.value = false
  if (!isOpen.value) emit("blur")
}

const onPointerDown = (event: PointerEvent) => {
  const target = event.target as Node | null
  const field = listRef.value?.closest(".field")
  if (field?.contains(target)) return
  close()
}

watch(isOpen, (openState) => {
  if (openState) document.addEventListener("pointerdown", onPointerDown)
  else document.removeEventListener("pointerdown", onPointerDown)
})

onUnmounted(() => {
  document.removeEventListener("pointerdown", onPointerDown)
})
</script>

<style scoped lang="scss">
.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: 1.1375rem;
  cursor: pointer;
  text-align: left;
}

.value.is-placeholder {
  opacity: 0.35;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  min-width: 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: var(--c-black);
  color: var(--c-white);
  font-size: 0.75rem;
  line-height: 1rem;
}

.tag-remove {
  display: flex;
  color: inherit;
}

.tag-remove :deep(.icon) {
  width: 0.5rem;
  height: 0.5rem;
  transform: rotate(45deg);
}

.caret {
  flex-shrink: 0;
  color: inherit;
  transform: rotate(90deg);
  margin-right: 0.1875rem;
  transition:
    transform var(--transition-fast),
    color var(--transition-fast);
}

:deep(.caret.icon) {
  width: 0.375rem;
}

.trigger.open .caret {
  transform: rotate(-90deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  min-width: 100%;
  max-height: 14.5rem;
  overflow-y: auto;
  overscroll-behavior: none;
  background: var(--c-white);
  color: var(--c-black);
  border: 0.0625rem solid var(--c-black);
  z-index: 8;
  outline: none;
}

.option {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 130%;
}

@include hover {
  .option:hover {
    background: rgba(6, 6, 6, 0.06);
  }
}

.option.active:not(.selected) {
  background: rgba(6, 6, 6, 0.06);
}

.option.selected,
.option.selected:hover {
  background: var(--c-black);
  color: var(--c-white);
}
</style>
