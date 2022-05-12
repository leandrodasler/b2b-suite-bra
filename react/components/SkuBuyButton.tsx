import React from 'react'
import { BuyButtonItem, Item } from '../typings'
import { useSku } from './SkuContext'

import { ExtensionPoint } from 'vtex.render-runtime'
import { path } from 'ramda'

interface Props {
  sku: Item
  selectedQuantity: number
}

const SkuBuyButton = () => {
  const { sku, selectedQuantity }: Props = useSku()
  const buyButtonItem: BuyButtonItem = {
    skuId: sku.itemId,
    seller: path<string | number>(['sellers', 0, 'sellerId'], sku),
    options: sku.options || [],
    quantity: selectedQuantity,
  }

  return (
    <div>
      <ExtensionPoint
        id="item-buy-button"
        selectedItem={sku}
        selectedQuantity={selectedQuantity}
        skuItems={[buyButtonItem]}
        isOneClickBuy={false}
        shouldAddToCart
      />
    </div>
  )
}

export default SkuBuyButton
