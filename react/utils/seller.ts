import type { Seller } from 'vtex.product-context/react/ProductTypes'

export const getDefaultSeller = (sellers?: Seller[]) => {
  if (!sellers?.length) {
    return
  }

  const defaultSeller = sellers.find((seller) => seller.sellerDefault)

  if (!defaultSeller) {
    return sellers[0]
  }

  return defaultSeller
}
