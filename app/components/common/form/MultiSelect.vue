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
        <span v-for="option in visibleOptions" :key="option.value" class="tag">
          <span>{{ option.label }}</span>
          <button
            class="tag-remove"
            type="button"
            :aria-label="`Remove ${option.label}`"
            @mousedown.stop.prevent
            @click.stop="remove(option.value)"
          >
            <IconClose />
          </button>
        </span>
        <span
          v-if="hiddenCount"
          class="tag tag-more"
          :aria-label="hiddenOptions.map((option) => option.label).join(', ')"
        >
          +{{ hiddenCount }}
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
        <span class="check" aria-hidden="true">
          <IconCheck />
        </span>
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

const visibleOptions = computed(() => selectedOptions.value.slice(0, 2))
const hiddenOptions = computed(() => selectedOptions.value.slice(2))
const hiddenCount = computed(() => hiddenOptions.value.length)

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
  cursor: pointer;
  text-align: left;
}

.value.is-placeholder {
  opacity: 0.5;
}

.tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.125rem;
  min-width: 0;
  overflow: hidden;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  min-width: 0;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6.25rem;
  color: var(--c-black);
  font-size: 0.75rem;
  line-height: 1rem;
}

.tag > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-more {
  flex-shrink: 0;
}

.tag-remove {
  display: flex;
  flex-shrink: 0;
  color: inherit;
  opacity: 0.5;
  transition: opacity 0.5s ease;
}

@include hover {
  .tag-remove:hover {
    opacity: 1;
  }
}

.tag-remove :deep(.icon) {
  width: 1rem;
  height: 1rem;
}

.caret {
  flex-shrink: 0;
  transition:
    transform var(--transition-fast),
    color var(--transition-fast);
}

.trigger.open .caret {
  transform: rotate(-180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  margin-top: 0.0625rem;
  left: 0;
  width: 100%;
  max-height: 14.5rem;
  overflow-y: auto;
  overscroll-behavior: none;
  background: var(--c-white);
  color: var(--c-black);
  z-index: 8;
  outline: none;
  box-shadow: 0 0.75rem 2rem 0.0625rem rgba(14, 18, 27, 0.1);
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 130%;
}

.check {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid rgba(0, 0, 0, 0.2);
  color: transparent;
}

.option.selected .check {
  background: var(--c-black);
  border-color: var(--c-black);
  color: var(--c-white);
}

@include hover {
  .option:hover {
    background: rgba(0, 0, 0, 0.02);
  }
}

.option.active:not(.selected) {
  background: rgba(0, 0, 0, 0.02);
}

.option.selected,
.option.selected:hover {
  background: rgba(0, 0, 0, 0.02);
}
</style>
