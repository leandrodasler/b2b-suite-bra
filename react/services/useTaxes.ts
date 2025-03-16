import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '.'
import { apiRequestFactory } from '.'

type Tax = {
  idCalculatorConfiguration: string
  name: string
  scope: { allCatalog: boolean }
}

type AllTaxesResponse = ApiResponse & Tax[]

export function useTaxes() {
  return useQuery<AllTaxesResponse, Error>({
    queryKey: ['get-all-taxes'],
    queryFn: apiRequestFactory<AllTaxesResponse>(
      '/_v/private/b2b-suite-bra/get-all-taxes'
    ),
  })
}
