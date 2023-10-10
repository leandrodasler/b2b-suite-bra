import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'

interface Props {
  benefits: Array<{
    minQuantity: number
    discount?: number
    fixedPrice?: number
  }>
  basePrice: number
  title?: string
}

const SkuPriceByQuantityTable = ({ benefits, basePrice }: Props) => {
  const firstQuantity = benefits[0]?.minQuantity
  const benefitsToRender = [
    ...(firstQuantity > 1 ? [{ minQuantity: 1, fixedPrice: basePrice }] : []),
    ...benefits,
  ]

  const renderFixedPrice = (fixedPrice: number) => (
    <FormattedCurrency value={fixedPrice} />
  )

  const renderPromotionPrice = (price: number, discount: number) =>
    renderFixedPrice(price * (1 - discount / 100))

  return (
    <table className="w-100">
      <tbody>
        <tr>
          {benefitsToRender.map((benefit, index) => (
            <th key={`benefit-quantity-${index}`}>
              {benefit?.minQuantity}
              {benefitsToRender.length === 1 && '+'}
            </th>
          ))}
        </tr>
        <tr>
          {benefitsToRender.map((benefit, index) => (
            <td align="center" key={`benefit-price-${index}`}>
              {benefit?.fixedPrice
                ? renderFixedPrice(benefit.fixedPrice)
                : !!benefit?.discount &&
                  renderPromotionPrice(basePrice, benefit.discount)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default SkuPriceByQuantityTable
