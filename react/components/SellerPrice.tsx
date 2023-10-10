import { path } from 'ramda'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import type { Seller } from 'vtex.product-context/react/ProductTypes'

import { Item } from '../typings'
import { useSkuSeller } from './SkuSellerContext'

const CSS_HANDLES = ['sellerPriceContainer'] as const

interface Props {
  showLabel: boolean
}

const SellerPrice = ({ showLabel }: Props) => {
  const { seller }: { seller: Seller; item: Item } = useSkuSeller()
  const sellingPrice: number | undefined = path(
    ['commertialOffer', 'Price'],
    seller
  )
  const handles = useCssHandles(CSS_HANDLES)

  return seller ? (
    <div className={handles.sellerPriceContainer}>
      {showLabel && (
        <span className="t-body c-on-base fw7 pr3">
          <FormattedMessage id="store/sku-list.seller.price.title" />:{' '}
        </span>
      )}
      <span>
        <FormattedCurrency value={sellingPrice} />
      </span>
    </div>
  ) : (
    <div />
  )
}

export default SellerPrice
