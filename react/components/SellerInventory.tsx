import { path } from 'ramda'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import type { Seller } from 'vtex.product-context/react/ProductTypes'

import { useSkuSeller } from './SkuSellerContext'

const CSS_HANDLES = ['sellerInventoryWrapper', 'sellerInventory'] as const

interface Props {
  showLabel: boolean
}

const SellerInventory = ({ showLabel }: Props) => {
  const { seller }: { seller: Seller } = useSkuSeller()
  const handles = useCssHandles(CSS_HANDLES)
  return seller ? (
    <div className={`${handles.sellerInventoryWrapper} lh-copy`}>
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          <FormattedMessage id="store/sku-list.inventory.title" />:{' '}
        </span>
      )}
      <span className={`${handles.sellerInventory}`}>
        {path(['commertialOffer', 'AvailableQuantity'], seller)}
      </span>
    </div>
  ) : (
    <div />
  )
}

export default SellerInventory
