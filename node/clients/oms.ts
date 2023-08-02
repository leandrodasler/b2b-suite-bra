import type { IOContext, InstanceOptions, RequestConfig } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { getFirstDayInMonth, getLastDayInMonth } from '../helpers'

export default class OMSClient extends JanusClient {
  private readonly baseUrl = '/api/oms/pvt/orders'
  private apiKey = ''
  private apiToken = ''

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      params: {
        ...options?.params,
        workspace: context.workspace,
      },
    })
  }

  public setApiSettings(apiKey: string, apiToken: string) {
    this.apiKey = apiKey
    this.apiToken = apiToken
  }

  private getAdditionalOptionsRequestConfig(): RequestConfig {
    return {
      forceMaxAge: 5000,
      headers: {
        ...this.options?.headers,
        'X-VTEX-API-AppKey': this.apiKey,
        'X-VTEX-API-AppToken': this.apiToken,
      },
    }
  }

  private async get(url: string) {
    return this.http.get(url, this.getAdditionalOptionsRequestConfig())
  }

  public async getMonthlyOrders() {
    return this.get(
      `${
        this.baseUrl
      }/?orderBy=creationDate,desc&f_creationDate=creationDate:[${getFirstDayInMonth()} TO ${getLastDayInMonth()}]&page=1&per_page=99999`
    )
  }

  public async search(query: string) {
    return this.get(`${this.baseUrl}?${query}`)
  }

  public async getOrder(id: string) {
    return this.get(`${this.baseUrl}/${id}`)
  }
}
