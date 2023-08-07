import { getLocale } from '.'

const hasNavigator = typeof navigator !== 'undefined'

export const formatNumber = (numberLiteral?: number) => {
  if (!numberLiteral || isNaN(numberLiteral)) {
    return ''
  }

  return hasNavigator && numberLiteral.toLocaleString(navigator.language)
}

export const getPercent = (current: number, total: number) =>
  (current / total) * 100

export const getPercentFormatted = (percentage: number) => {
  const locale = getLocale()
  return (percentage / 100).toLocaleString(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
