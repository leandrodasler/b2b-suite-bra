import React from 'react'
import { Spinner } from 'vtex.styleguide'

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

  const { data: tradePolicyData, isLoading: tradePolicyLoading } =
    useCurrentTradePolicy()

  const { data: fixedPrices, loading: fixedPricesLoading } = useFixedPrices(
    selectedItem?.itemId,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  const loading = tradePolicyLoading || fixedPricesLoading

  if (loading) {
    return (
      <div className="flex justify-center ma4">
        <Spinner />
      </div>
    )
  }

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
