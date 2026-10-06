<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <div class="hp" aria-hidden="true">
      <label>
        Website
        <input
          v-model="form.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </label>
    </div>

    <div class="fields">
      <CommonFormInput
        v-model="form.name"
        label="Your contact name*"
        placeholder="Jane Smith"
        name="name"
        autocomplete="name"
        required
        :error="visibleError('name')"
        @blur="onBlur('name')"
      />

      <div class="phone">
        <p class="phone-label p2">Your phone number<span class="mark">**</span></p>
        <div class="phone-row">
          <CommonFormSelect
            v-model="form.phoneCode"
            class="code-select"
            placeholder="Code"
            name="phoneCode"
            searchable
            :options="codeOptions"
            required
            :error="visibleError('phoneCode')"
            @blur="onBlur('phoneCode')"
          />
          <CommonFormInput
            v-model="form.phone"
            placeholder="(415) 555-0199"
            name="phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel-national"
            digits-only
            required
            :error="visibleError('phone')"
            @blur="onBlur('phone')"
          />
        </div>
      </div>

      <CommonFormInput
        v-model="form.email"
        label="Your e-mail*"
        placeholder="jane@email.com"
        name="email"
        type="email"
        autocomplete="email"
        required
        :error="visibleError('email')"
        @blur="onBlur('email')"
      />

      <CommonFormMultiSelect
        v-model="form.services"
        label="What service are you interested in*"
        placeholder="Select a service"
        name="services"
        :options="serviceOptions"
        required
        :error="visibleError('services')"
        @blur="onBlur('services')"
      />

      <CommonFormTextarea
        v-model="form.message"
        label="Tell us about the project (optional)"
        placeholder="Share your idea, goals or deadlines."
        name="message"
        :error="visibleError('message')"
        @blur="onBlur('message')"
      />
    </div>

    <div class="form-actions">
      <CommonButtonTemplate
        class="form-btn"
        text="Send request"
        black
        submit
        :disabled="isSubmitting"
      />
      <p v-if="submitError" class="submit-error">{{ submitError }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { countries } from "~/utils/form/countries"
import { validateEmail, validatePhone, validateStringByLength } from "~/utils/validation"

type FieldName = "name" | "phoneCode" | "phone" | "email" | "services" | "message"

const form = reactive({
  name: "",
  phoneCode: "US",
  phone: "",
  email: "",
  services: [] as string[],
  message: "",
  website: "",
})

const errors = reactive<Record<FieldName, string>>({
  name: "",
  phoneCode: "",
  phone: "",
  email: "",
  services: "",
  message: "",
})

const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  phoneCode: false,
  phone: false,
  email: false,
  services: false,
  message: false,
})

const emit = defineEmits<{
  success: []
}>()

const submitAttempted = ref(false)
const isSubmitting = ref(false)
const submitError = ref("")

const serviceOptions = [
  { value: "Design", label: "Design" },
  { value: "Development", label: "Development" },
  { value: "Marketing", label: "Marketing" },
  { value: "Production", label: "Production" },
]

const codeOptions = countries.map((country) => ({
  value: country.iso,
  label: `+${country.dial}`,
  hint: country.name,
  iso: country.iso,
}))

watch(
  () => [...form.services],
  () => {
    if (submitAttempted.value || touched.services) validateField("services")
  }
)

const validateField = (field: FieldName) => {
  if (field === "name") {
    const value = form.name.trim()
    if (!value) errors.name = "Name is required"
    else if (!validateStringByLength(value, { min: 2, max: 80 })) {
      errors.name = "Enter a valid name"
    } else if (!/^[\p{L}\s.'’-]+$/u.test(value)) {
      errors.name = "Enter a valid name"
    } else errors.name = ""
    return
  }

  if (field === "phoneCode") {
    errors.phoneCode = form.phoneCode ? "" : "Code is required"
    return
  }

  if (field === "phone") {
    const value = form.phone.trim()
    if (!value) errors.phone = "Phone number is required"
    else if (!validatePhone(value)) errors.phone = "Enter a valid phone number"
    else errors.phone = ""
    return
  }

  if (field === "email") {
    const value = form.email.trim()
    if (!value) errors.email = "Email is required"
    else if (!validateEmail(value.toLowerCase())) errors.email = "Enter a valid email"
    else errors.email = ""
    return
  }

  if (field === "services") {
    errors.services = form.services.length ? "" : "Select a service"
    return
  }

  if (field === "message") {
    errors.message = validateStringByLength(form.message.trim(), { min: 0, max: 1000 })
      ? ""
      : "Message is too long"
  }
}

const validateForm = () => {
  ;(
    ["name", "phoneCode", "phone", "email", "services", "message"] as FieldName[]
  ).forEach(validateField)
  return (
    !errors.name &&
    !errors.phoneCode &&
    !errors.phone &&
    !errors.email &&
    !errors.services &&
    !errors.message
  )
}

const visibleError = (field: FieldName) => {
  return submitAttempted.value || touched[field] ? errors[field] : ""
}

const onBlur = (field: FieldName) => {
  touched[field] = true
  validateField(field)
}

const onSubmit = async () => {
  submitAttempted.value = true
  submitError.value = ""
  if (!validateForm() || isSubmitting.value) return

  isSubmitting.value = true

  try {
    await $fetch("/api/form", {
      method: "POST",
      body: {
        name: form.name,
        phoneCode: countries.find((item) => item.iso === form.phoneCode)?.dial ?? "",
        phone: form.phone,
        email: form.email,
        services: form.services,
        message: form.message,
        website: form.website,
      },
    })

    emit("success")
  } catch (error) {
    console.log("Error submitting form:", error)
    submitError.value = "Something went wrong. Please try again."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.form {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.75rem;
  row-gap: 2rem;
  align-items: flex-start;
}

.phone-label {
  margin-bottom: 0.75rem;
  line-height: 1rem;
}

.mark {
  color: var(--c-red);
  font-size: 1rem;
  line-height: 1;
}

.phone-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  border-bottom: 0.0625rem solid rgba(0, 0, 0, 0.1);
  transition: border-color var(--transition-fast);

  &:has(.has-error) {
    border-color: var(--c-red);
  }

  :deep(.field) {
    border-bottom: none;
  }

  > :last-child :deep(input) {
    padding-left: 0.75rem;
  }

  > :last-child :deep(.error) {
    left: -6.5rem;
  }
}

.code-select {
  &::after {
    content: "";
    position: absolute;
    top: 0.1875rem;
    right: 0;
    width: 0.0625rem;
    height: 1rem;
    background: rgba(0, 0, 0, 0.1);
  }

  :deep(.trigger) {
    padding-right: 0.75rem;
  }

  :deep(.dropdown) {
    min-width: 16rem;
  }
}

.form-actions {
  margin-top: auto;
  padding-top: 2rem;
}

.form-btn {
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.submit-error {
  text-align: center;
  color: var(--c-red);
  font-size: 0.75rem;
  line-height: 120%;
}

.hp {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
</style>
