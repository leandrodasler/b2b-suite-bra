import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { Installment } from '../../typings'

const CSS_HANDLES = ['priceContainer'] as const

interface Props {
  sellingPrice?: number
  listPrice?: number
  unitMultiplier?: number
  installments?: Installment[]
}

const SellerPriceLegacy = ({ sellingPrice }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.priceContainer}>
      <span>
        <FormattedCurrency value={sellingPrice} />
      </span>
    </div>
  )
}

export default SellerPriceLegacy
