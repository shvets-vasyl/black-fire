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
  const message = String(body?.message ?? "").trim()

  if (
    !name ||
    !phoneCode ||
    !phone ||
    !email ||
    !services.length ||
    message.length > 1000
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid form data",
    })
  }

  await sendFormMail({
    name,
    phone: `+${phoneCode} ${phone}`,
    email,
    services,
    message,
  })

  return { ok: true }
})
