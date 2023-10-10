import { useQuery } from 'react-apollo'
import type {
  FixedPrice,
  Maybe,
  Query as QueryGetFixedPrices,
} from 'ssesandbox04.progressive-discount-table'

import GET_FIXED_PRICES from '../graphql/getFixedPrices.graphql'

export const useFixedPrices = (
  skuId?: string,
  priceTables?: string[],
  tradePolicy?: string
) => {
  const { data, loading, error } = useQuery<QueryGetFixedPrices>(
    GET_FIXED_PRICES,
    {
      variables: { skuId },
      skip: !skuId || !tradePolicy,
    }
  )

  const fixedPricesByPriceTables = data?.getFixedPrices?.filter(
    (fixedPrice: Maybe<FixedPrice>) =>
      !!fixedPrice && priceTables?.includes(fixedPrice.tradePolicyId)
  )

  if (fixedPricesByPriceTables?.length) {
    return { data: fixedPricesByPriceTables, loading, error }
  }

  return {
    data: data?.getFixedPrices?.filter(
      (fixedPrice: Maybe<FixedPrice>) =>
        fixedPrice?.tradePolicyId === tradePolicy
    ),
    loading,
    error,
  }
}
