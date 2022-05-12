import React from 'react'
import { useSkuSeller } from './SkuSellerContext'
import { Seller, Item } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { path } from 'ramda'
import { FormattedCurrency } from 'vtex.format-currency'
import { FormattedMessage } from 'react-intl'

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
