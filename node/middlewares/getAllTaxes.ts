const getAllTaxes = async (context: Context, next: Next) => {
  const {
    clients: { taxClient },
  } = context

  const taxes = await taxClient.getAllTaxes()

  context.state.body = taxes.items.filter(tax => tax.scope.allCatalog)

  await next()
}

export default getAllTaxes
