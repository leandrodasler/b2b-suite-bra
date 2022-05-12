const hasNavigator = typeof navigator !== 'undefined'

export const formatNumber = (numberLiteral?: number) => {
  if (!numberLiteral || isNaN(numberLiteral)) {
    return ''
  }

  return hasNavigator && numberLiteral.toLocaleString(navigator.language)
}
