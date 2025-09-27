import React from 'react'

import {
  useCurrentTradePolicy,
  useFixedPrices,
  useProductWithBenefits,
  withQueryProvider,
} from '../services'

type Props = {
  Then: React.ComponentType
  Else: React.ComponentType
}

const BenefitsCondition = ({ Then, Else }: Props) => {
  const { selectedItem, benefits } = useProductWithBenefits()
  const { data: tradePolicyData } = useCurrentTradePolicy()
  const { data: fixedPrices } = useFixedPrices(
    selectedItem?.itemId,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  if (
    (fixedPrices?.length &&
      (fixedPrices.length > 1 ||
        (fixedPrices.length === 1 && fixedPrices[0].minQuantity > 1))) ||
    benefits?.length
  ) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default withQueryProvider(BenefitsCondition)
