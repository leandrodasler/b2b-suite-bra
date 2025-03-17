function compareDateToNow(date: string, mode: 'before' | 'after') {
  const now = Date.now()
  const inputMs = new Date(date).getTime()

  return mode === 'before' ? inputMs <= now : inputMs >= now
}

function isBeforeNow(date: string) {
  return compareDateToNow(date, 'before')
}

function isAfterNow(date: string) {
  return compareDateToNow(date, 'after')
}

function isValidTax(tax: Tax) {
  return (
    tax.isActive &&
    isBeforeNow(tax.beginDate) &&
    isAfterNow(tax.endDate) &&
    tax.scope.allCatalog
  )
}

const getAllTaxes = async (context: Context, next: Next) => {
  const {
    clients: { taxClient },
  } = context

  const taxes = await taxClient.getAllTaxes()

  context.state.body = taxes.items.filter(isValidTax)

  await next()
}

export default getAllTaxes
