import { useProduct } from 'vtex.product-context'
import type { ProductContextState } from 'vtex.product-context/react/ProductTypes'

import { getDefaultSeller } from '../utils/seller'

interface Benefit {
  teaserType?: string
  items?: Array<{
    minQuantity?: number
    discount?: number
  }>
}

interface ProductWithBenefits {
  product?: {
    benefits?: Benefit[]
  }
}

type ProductContextWithBenefits =
  | (Partial<ProductContextState> & ProductWithBenefits)
  | undefined

export const useProductWithBenefits = () => {
  const productContextValue = useProduct() as ProductContextWithBenefits
  const benefits = productContextValue?.product?.benefits?.filter(
    (b) => b?.teaserType === 'Catalog'
  )

  const productName = productContextValue?.product?.productName
  const selectedItem = productContextValue?.selectedItem
  const seller = getDefaultSeller(selectedItem?.sellers)
  const commertialOffer = seller?.commertialOffer

  const measurementUnit = selectedItem?.measurementUnit ?? ''
  const price = commertialOffer?.Price
  const teasers = commertialOffer?.teasers

  return {
    productName,
    selectedItem,
    benefits,
    measurementUnit,
    price,
    teasers,
  }
}