type FormBody = {
  name?: string
  phoneCode?: string
  phone?: string
  email?: string
  services?: string[]
  message?: string
  website?: string
}

async function readJsonBody(req: AsyncIterable<Uint8Array | string>) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk))
  }

  const raw = Buffer.concat(chunks).toString("utf8")
  if (!raw) return {} as FormBody
  return JSON.parse(raw) as FormBody
}

export default defineEventHandler(async (event) => {
  const body = await readJsonBody(event.node.req)

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
    throw createError({ statusCode: 400, statusMessage: "Invalid form data" })
  }

  return { ok: true }
})