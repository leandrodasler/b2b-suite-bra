import { getLocale } from '.'

export const formatDate = (date: string): string => {
  const dateObject = new Date(date)
  const locale = getLocale()
  const formattedDate = new Intl.DateTimeFormat(locale).format(dateObject)
  const formattedHour = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObject)

  return `${formattedDate} - ${formattedHour}`
}

export const getRemainingDaysInMonth = () => {
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return lastDay.getDate() - today.getDate()
}
