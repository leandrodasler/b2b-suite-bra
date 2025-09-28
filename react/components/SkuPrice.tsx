import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'

import type { Item } from '../typings'
import { getDefaultSeller } from '../utils/seller'
import { useSku } from './SkuContext'

const CSS_HANDLES = ['priceContainer'] as const

interface Props {
  showLabel: boolean
}

const SkuPrice = ({ showLabel }: Props) => {
  const { sku }: { sku: Item } = useSku()

  const seller = getDefaultSeller(sku?.sellers)
  const commertialOffer = seller?.commertialOffer
  const sellingPrice = commertialOffer?.Price
  const listPrice = commertialOffer?.ListPrice

  const handles = useCssHandles(CSS_HANDLES)

  return sellingPrice ? (
    <div
      className={`pt3 pb5 t-body c-muted-1 lh-copy ${handles.priceContainer}`}
    >
      <div className="inline-flex">
        {showLabel && (
          <span className="t-body c-on-base fw7 pr3">
            <FormattedMessage id="store/sku-list.sku.price.title" />:{' '}
          </span>
        )}
        <div className="flex flex-column">
          {listPrice && listPrice > sellingPrice && (
            <span className="strike c-muted-2">
              <FormattedCurrency value={listPrice} />
            </span>
          )}
          <span>
            <FormattedCurrency value={sellingPrice} />
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )
}

export default SkuPrice
