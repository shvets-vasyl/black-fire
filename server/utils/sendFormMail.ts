import { createTransport } from "nodemailer"

type FormMail = {
  name: string
  phone: string
  email: string
  services: string[]
  message: string
}

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim()

export async function sendFormMail(form: FormMail) {
  const { mail } = useRuntimeConfig()
  const pass = String(mail.pass ?? "").replace(/\s/g, "")

  if (!pass) {
    console.error("Form mail is not configured. Set NUXT_MAIL_PASS.")
    throw createError({
      statusCode: 500,
      statusMessage: "Could not send the request",
    })
  }

  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: mail.user,
      pass,
    },
  })

  try {
    await transport.sendMail({
      from: mail.user,
      to: mail.to,
      replyTo: oneLine(form.email),
      subject: `New request from ${oneLine(form.name)}`,
      text: [
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email}`,
        `Services: ${form.services.join(", ")}`,
        "",
        form.message || "No message",
      ].join("\n"),
    })
  } catch (error) {
    console.error("Failed to send form mail", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Could not send the request",
    })
  }
}
