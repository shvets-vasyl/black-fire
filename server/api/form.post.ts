import { HTTPError } from "h3"

type FormBody = {
  name?: string
  phoneCode?: string
  phone?: string
  email?: string
  services?: string[]
  message?: string
  website?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<FormBody>(event)

  if (String(body?.website ?? "").trim()) {
    return { ok: true }
  }

  const name = String(body?.name ?? "").trim()
  const phoneCode = String(body?.phoneCode ?? "").trim()
  const phone = String(body?.phone ?? "").trim()
  const email = String(body?.email ?? "")
    .trim()
    .toLowerCase()
  const services = Array.isArray(body?.services)
    ? body.services.map((item) => String(item).trim()).filter(Boolean)
    : []

  if (!name || !phoneCode || !phone || !email || !services.length) {
    throw HTTPError.status(400, "Invalid form data")
  }

  return { ok: true }
})
