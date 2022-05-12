import React, { ReactNode } from 'react'
import { Item, Product, Seller } from '../typings'
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
