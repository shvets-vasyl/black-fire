export function validatePhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 6 && digits.length <= 15
}
