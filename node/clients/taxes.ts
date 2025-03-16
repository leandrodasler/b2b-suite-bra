import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const BASE_URL = '/api/rnb/pvt/taxes/calculatorconfiguration'

type Tax = {
  idCalculatorConfiguration: string
  name: string
  scope: { allCatalog: boolean }
}

type AllTaxesResponse = { items: Tax[] }

export default class TaxClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async getAllTaxes() {
    return this.http.get<AllTaxesResponse>(BASE_URL)
  }
}
