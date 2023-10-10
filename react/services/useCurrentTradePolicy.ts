import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '.'
import { apiRequestFactory } from '.'

interface TradePolicyResponse extends ApiResponse {
  id: string
  namespaces?: {
    public?: {
      sc?: { value?: string }
    }
    'storefront-permissions'?: {
      priceTables?: { value?: string }
    }
  }
}

export const useCurrentTradePolicy = () => {
  return useQuery({
    queryKey: ['currentTradePolicies'],
    queryFn: async () =>
      apiRequestFactory<TradePolicyResponse>(
        '/api/sessions?items=public.sc,storefront-permissions.priceTables'
      )().then((response) => {
        const publicNamespace = response.namespaces?.public
        const permissionsNamespace =
          response.namespaces?.['storefront-permissions']

        if (!publicNamespace || !permissionsNamespace) {
          throw new Error('Invalid session')
        }

        return {
          tradePolicy: publicNamespace.sc?.value,
          priceTables: permissionsNamespace.priceTables?.value?.split(','),
        }
      }),
    retry: 2,
  })
}
