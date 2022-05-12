import React from 'react'
import { Item } from '../typings'
import { useSku } from './SkuContext'

import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  showLabel: boolean
}

const SkuQuantitySelector = ({ showLabel = false }: Props) => {
  const {
    sku,
    selectedQuantity,
  }: { sku: Item; selectedQuantity: number } = useSku()

  return (
    <div>
      <ExtensionPoint
        id="item-quantity"
        selectedItem={sku}
        showLabel={showLabel}
        selectedQuantity={selectedQuantity}
      />
    </div>
  )
}

export default SkuQuantitySelector
