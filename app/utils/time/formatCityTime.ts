export function formatCityTime(timeZone: string, city: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date)

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${value("hour")}:${value("minute")} ${value("dayPeriod").toUpperCase()}, ${city.toLowerCase()}`
}
