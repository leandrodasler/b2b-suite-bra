import React from 'react'
import { FixedPrice, Maybe } from 'ssesandbox04.progressive-discount-table'

import {
  useCurrentTradePolicy,
  useFixedPrices,
  useSkuWithBenefits,
  withQueryProvider,
} from '../../services'
import SkuPriceByQuantityTable from './table'

const SkuPriceByQuantity = () => {
  const {
    itemId,
    isFirstItem,
    price = 0,
    benefits,
    teasers,
  } = useSkuWithBenefits()
  const { data: tradePolicyData } = useCurrentTradePolicy()
  const { data: fixedPrices } = useFixedPrices(
    itemId,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  if (fixedPrices?.length) {
    return (
      <SkuPriceByQuantityTable
        isFirstItem={isFirstItem}
        basePrice={price}
        benefits={fixedPrices.map((f: Maybe<FixedPrice>) => ({
          minQuantity: f?.minQuantity ?? 1,
          fixedPrice: f?.value,
        }))}
      />
    )
  }

  if (!benefits?.length) {
    if (teasers?.length && teasers?.[0]?.effects?.parameters?.length) {
      return (
        <SkuPriceByQuantityTable
          isFirstItem={isFirstItem}
          basePrice={price}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          benefits={teasers.map((t: any) => ({
            minQuantity: t.conditions?.minimumQuantity,
            discount:
              t.effects?.parameters[0].name === 'PercentualDiscount'
                ? +t.effects?.parameters[0].value
                : 0,
          }))}
        />
      )
    }

    return (
      <SkuPriceByQuantityTable
        isFirstItem={isFirstItem}
        basePrice={price}
        benefits={[{ minQuantity: 1, fixedPrice: price }]}
      />
    )
  }

  return (
    <SkuPriceByQuantityTable
      isFirstItem={isFirstItem}
      basePrice={price}
      benefits={benefits.map(b => ({
        minQuantity: b?.items?.[0]?.minQuantity ?? 1,
        discount: b?.items?.[0]?.discount ?? 0,
      }))}
    />
  )
}

export default withQueryProvider(SkuPriceByQuantity)
