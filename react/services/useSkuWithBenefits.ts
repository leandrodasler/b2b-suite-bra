import { useProduct } from 'vtex.product-context'

import { useSku } from '../components/SkuContext'
import { Product } from '../typings'
import { getDefaultSeller } from '../utils/seller'

export const useSkuWithBenefits = () => {
  const { sku, selectedQuantity } = useSku()
  const productContext = useProduct()
  const product = productContext?.product as Product
  const benefits = product?.benefits?.filter(b => b?.teaserType === 'Catalog')
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
    selectedQuantity,
    productName,
    benefits,
    measurementUnit,
    price,
    teasers,
  }
}
