import { useProduct } from 'vtex.product-context'

import { useSku } from '../components/SkuContext'
import type { Product } from '../typings'
import { distinctBenefits } from '../utils/benefits'
import { getDefaultSeller } from '../utils/seller'

export const useSkuWithBenefits = () => {
  const { sku, isFirstItem, selectedQuantity } = useSku()
  const productContext = useProduct()
  const product = productContext?.product as Product
  const benefits = distinctBenefits(
    product?.benefits?.filter(b => b?.teaserType === 'Catalog')
  )

  const productName = product?.productName
  const itemId = sku?.itemId
  const itemName = sku.name
  const seller = getDefaultSeller(sku?.sellers)
  const commertialOffer = seller?.commertialOffer
  const measurementUnit = sku?.measurementUnit ?? ''
  const price = commertialOffer?.Price
  const teasers = commertialOffer?.teasers

  return {
    itemId,
    itemName,
    isFirstItem,
    selectedQuantity,
    productName,
    benefits,
    measurementUnit,
    price,
    teasers,
  }
}
