import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import type { Seller } from 'vtex.product-context/react/ProductTypes'

import { useSkuSeller } from './SkuSellerContext'

const CSS_HANDLES = ['sellerName'] as const

interface Props {
  showLabel: boolean
}

const SellerName = ({ showLabel }: Props) => {
  const { seller }: { seller: Seller } = useSkuSeller()
  const handles = useCssHandles(CSS_HANDLES)
  return seller ? (
    <div>
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          <FormattedMessage id="store/sku-list.seller.name.title" />:{' '}
        </span>
      )}
      <h5 className={`${handles.sellerName} t-heading-5 c-muted-1`}>
        {seller.sellerName}
      </h5>
    </div>
  ) : (
    <div />
  )
}

export default SellerName
