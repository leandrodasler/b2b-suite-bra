import React, { ReactNode } from 'react'
import type { Seller } from 'vtex.product-context/react/ProductTypes'

import { Item, Product } from '../typings'
import { SkuSellerProvider } from './SkuSellerContext'

interface Props {
  seller: Seller
  item: Item
  product: Product
  children?: ReactNode[]
}

const SkuSeller = ({ seller, item, product, children }: Props) => {
  return (
    <SkuSellerProvider seller={seller} item={item} product={product}>
      {children}
    </SkuSellerProvider>
  )
}

export default SkuSeller
