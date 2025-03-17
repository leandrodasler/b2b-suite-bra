import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC } from 'react'
import React from 'react'

export * from './useCurrentTradePolicy'
export * from './useFixedPrices'
export * from './useProductWithBenefits'
export * from './useSkuWithBenefits'
export * from './useTaxes'

export interface ApiResponse {
  code?: string
  message?: string
  response?: { data?: string | { error?: string } }
}

const MAX_RETRIES = 10

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const e = error as Error

        console.error('Query Error:', {
          errorMessage: e.message,
          failureCount: `${failureCount}/${MAX_RETRIES}`,
        })

        return (
          (e.message.toLowerCase().includes('unhealthy') ||
            e.message.toLowerCase().includes('genericerror')) &&
          failureCount < MAX_RETRIES
        )
      },
    },
  },
})

export function withQueryProvider<P>(Component?: FC<P>) {
  const WrappedComponent: FC<P> = props => (
    <QueryClientProvider client={queryClient}>
      {Component && <Component {...props} />}
    </QueryClientProvider>
  )

  return WrappedComponent
}

export function apiRequestFactory<T extends ApiResponse>(
  url: string,
  method = 'GET'
) {
  return async function request() {
    const response = await fetch(url, { method })
    const json: T = await response.json()

    if (!response.ok) {
      throw new Error(
        typeof json?.response?.data === 'object'
          ? json?.response?.data?.error
          : json?.response?.data ??
            json?.message ??
            json?.code ??
            response.status.toString()
      )
    }

    return json
  }
}
