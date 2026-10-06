<template>
  <CommonFormField
    :error="error"
    :open="isOpen"
    :focused="focused"
    :filled="!!model"
    :label="label"
    :html-for="triggerId"
  >
    <input :name="name" type="hidden" :value="model" :required="required || undefined" />

    <button
      :id="triggerId"
      class="trigger"
      type="button"
      :class="{ open: isOpen }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="listId"
      :aria-describedby="error ? errorId : undefined"
      :aria-label="label ? undefined : placeholder"
      @click="toggle"
      @keydown="onTriggerKeydown"
      @focus="focused = true"
      @blur="onTriggerBlur"
    >
      <span class="value" :class="{ 'is-placeholder': !model }">
        <img
          v-if="selectedOption?.iso"
          class="flag"
          :src="flagSrc(selectedOption.iso)"
          alt=""
        />
        <span>{{ selectedLabel || placeholder }}</span>
      </span>
      <IconCaret class="caret" />
    </button>

    <div v-if="isOpen" class="dropdown" data-lenis-prevent>
      <input
        v-if="searchable"
        ref="searchRef"
        v-model="query"
        class="search"
        type="text"
        placeholder="Search"
        autocomplete="off"
        aria-label="Search country"
        :aria-controls="listId"
        @keydown="onSearchKeydown"
        @mousedown.stop
      />
      <ul
        :id="listId"
        ref="listRef"
        class="list"
        role="listbox"
        :aria-labelledby="triggerId"
        tabindex="-1"
        @keydown="onListKeydown"
        @wheel="onWheel"
      >
        <li v-if="!visibleOptions.length" class="empty">No matches</li>
        <li
          v-for="(option, index) in visibleOptions"
          :id="optionId(index)"
          :key="option.value"
          class="option p2"
          role="option"
          :aria-selected="option.value === model"
          :class="{ active: index === activeIndex, selected: option.value === model }"
          @mousedown.prevent="select(option.value)"
        >
          <span class="option-label">
            <img v-if="option.iso" class="flag" :src="flagSrc(option.iso)" alt="" />
            <span>{{ option.label }}</span>
          </span>
          <span v-if="option.hint" class="hint">{{ option.hint }}</span>
        </li>
      </ul>
    </div>
  </CommonFormField>
</template>

<script setup lang="ts">
export type FormSelectOption = {
  value: string
  label: string
  hint?: string
  iso?: string
}

const flagSrc = (iso: string) => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`

const props = defineProps<{
  label?: string
  placeholder?: string
  options: FormSelectOption[]
  name?: string
  error?: string
  required?: boolean
  searchable?: boolean
}>()

const emit = defineEmits<{
  blur: []
}>()

const model = defineModel<string>({ default: "" })
const isOpen = ref(false)
const focused = ref(false)
const activeIndex = ref(-1)
const listRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const query = ref("")
const uid = useId()
const triggerId = computed(() => `select-${uid}`)
const listId = computed(() => `list-${uid}`)
const errorId = computed(() => `error-${uid}`)
let searchBuffer = ""
let searchTimer: ReturnType<typeof setTimeout> | null = null

const selectedOption = computed(() =>
  props.options.find((option) => option.value === model.value)
)

const selectedLabel = computed(() => {
  if (!model.value) return ""
  return selectedOption.value?.label || `+${model.value}`
})

const optionId = (index: number) => `option-${uid}-${index}`

const visibleOptions = computed(() => {
  const term = query.value.trim().toLowerCase().replace(/^\+/, "")
  if (!props.searchable || !term) return props.options
  return props.options.filter((option) => {
    const label = option.label.toLowerCase().replace(/^\+/, "")
    const hint = option.hint?.toLowerCase() ?? ""
    const iso = option.iso?.toLowerCase() ?? ""
    return label.includes(term) || hint.includes(term) || iso.includes(term)
  })
})

const open = () => {
  if (isOpen.value) return
  isOpen.value = true
  query.value = ""
  const selected = visibleOptions.value.findIndex(
    (option) => option.value === model.value
  )
  activeIndex.value = selected >= 0 ? selected : -1
  nextTick(() => {
    if (props.searchable) searchRef.value?.focus()
    else listRef.value?.focus()
    scrollActiveIntoView()
  })
}

const close = () => {
  isOpen.value = false
  activeIndex.value = -1
  query.value = ""
}

const toggle = () => {
  if (isOpen.value) close()
  else open()
}

const select = (value: string) => {
  model.value = model.value === value ? "" : value
  close()
  emit("blur")
}

const move = (step: number) => {
  const count = visibleOptions.value.length
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

const applyTypeahead = (key: string) => {
  searchBuffer += key.toLowerCase()
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    searchBuffer = ""
  }, 600)

  const index = visibleOptions.value.findIndex(
    (option) =>
      option.label.toLowerCase().startsWith(searchBuffer) ||
      option.hint?.toLowerCase().startsWith(searchBuffer)
  )
  if (index < 0) return
  activeIndex.value = index
  scrollActiveIntoView()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    open()
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
    const option = visibleOptions.value[activeIndex.value]
    if (option) select(option.value)
    return
  }

  if (event.key.length === 1 && /[\p{L}\d]/u.test(event.key)) {
    applyTypeahead(event.key)
  }
}

const onSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault()
    move(event.key === "ArrowDown" ? 1 : -1)
    return
  }

  if (event.key === "Enter") {
    event.preventDefault()
    const option = visibleOptions.value[activeIndex.value] ?? visibleOptions.value[0]
    if (option) select(option.value)
    return
  }

  if (event.key === "Escape") {
    event.preventDefault()
    close()
  }
}

watch(query, () => {
  if (!isOpen.value) return
  activeIndex.value = visibleOptions.value.length ? 0 : -1
  nextTick(scrollActiveIntoView)
})

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
  if (searchTimer) clearTimeout(searchTimer)
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

.value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.flag {
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

.value.is-placeholder {
  opacity: 0.35;
}

.caret {
  margin-right: 0.5rem;
  margin-top: 0.125rem;
  flex-shrink: 0;
  color: inherit;
  transition:
    transform var(--transition-fast),
    color var(--transition-fast);
}

.trigger.open .caret {
  transform: rotate(-180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  min-width: 100%;
  max-height: 14.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--c-white);
  color: var(--c-black);
  border: 0.0625rem solid rgba(0, 0, 0, 0.1);
  z-index: 8;
}

.search {
  flex-shrink: 0;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-bottom: 0.0625rem solid rgba(6, 6, 6, 0.15);
  color: var(--c-black);
  font-family: var(--f-regular);
  font-size: 0.875rem;
  line-height: 130%;
}
input.search {
  height: auto;
}

.search::placeholder {
  color: rgba(6, 6, 6, 0.35);
}

.list {
  overflow-y: auto;
  overscroll-behavior: none;
  outline: none;
}

.empty {
  padding: 0.625rem 0.75rem;
  opacity: 0.45;
  font-size: 0.875rem;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  white-space: nowrap;
}

.hint {
  opacity: 0.45;
  text-transform: none;
}

@include hover {
  .option:hover {
    background: rgba(6, 6, 6, 0.06);
  }
}

.option.active:not(.selected) {
  background: rgba(6, 6, 6, 0.06);
}

.option.selected {
  background: var(--c-black);
  color: var(--c-white);
}
</style>
