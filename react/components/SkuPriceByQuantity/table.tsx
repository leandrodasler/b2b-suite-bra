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
  listPrice?: number
  title?: string
}

const getPriceWithDiscount = (price: number, discount = 0) =>
  price * (1 - discount / 100)

const SkuPriceByQuantityTable = ({
  benefits,
  basePrice,
  listPrice,
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

  return (
    <table className={`w-100 ${handles.priceByQuantityTable}`} cellPadding="4">
      <tbody>
        {(isFirstItem || isMobile) && benefitsToRender.length > 1 && (
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
          {benefitsToRender.map((benefit, index) => {
            const price =
              benefit?.fixedPrice ??
              getPriceWithDiscount(basePrice, benefit.discount)

            return (
              <td
                align="center"
                key={`benefit-price-${index}`}
                className={handles.priceByQuantityValue}
              >
                <div className="flex flex-column">
                  {listPrice && listPrice > price && (
                    <span className="strike c-muted-2">
                      <FormattedCurrency value={listPrice} />
                    </span>
                  )}
                  {price !== null && <FormattedCurrency value={price} />}
                </div>
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}

export default SkuPriceByQuantityTable
