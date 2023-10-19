import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { FormattedCurrency } from 'vtex.format-currency'

interface Props {
  benefits: Array<{
    minQuantity: number
    discount?: number
    fixedPrice?: number
  }>
  isFirstItem: boolean
  basePrice: number
  title?: string
}

const SkuPriceByQuantityTable = ({
  benefits,
  basePrice,
  isFirstItem,
}: Props) => {
  const { isMobile } = useDevice()
  const handles = useCssHandles([
    'priceByQuantityTable',
    'priceByQuantityHeader',
    'priceByQuantityValue',
  ])
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
    <table className={`w-100 ${handles.priceByQuantityTable}`} cellPadding="4">
      <tbody>
        {(isFirstItem || isMobile) && (
          <tr className={handles.priceByQuantityHeader}>
            {benefitsToRender.map((benefit, index) => (
              <th key={`benefit-quantity-${index}`} className="bg-muted-4">
                {benefit?.minQuantity}
                {index === benefitsToRender.length - 1 && '+'}
              </th>
            ))}
          </tr>
        )}
        <tr>
          {benefitsToRender.map((benefit, index) => (
            <td
              align="center"
              key={`benefit-price-${index}`}
              className={handles.priceByQuantityValue}
            >
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
