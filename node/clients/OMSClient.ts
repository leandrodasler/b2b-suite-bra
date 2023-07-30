import type { IOContext, InstanceOptions } from '@vtex/api'
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
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  public setApiSettings(apiKey: string, apiToken: string) {
    this.apiKey = apiKey
    this.apiToken = apiToken
  }

  private getAdditionalOptionsRequestConfig() {
    return {
      headers: {
        ...this.options?.headers,
        'X-VTEX-API-AppKey': this.apiKey,
        'X-VTEX-API-AppToken': this.apiToken,
      },
    }
  }

  public async getMonthlyOrders() {
    return this.http.get(
      `${
        this.baseUrl
      }/?creationDate,desc&f_creationDate=creationDate:[${getFirstDayInMonth()} TO ${getLastDayInMonth()}]&page=1&per_page=99999`,
      this.getAdditionalOptionsRequestConfig()
    )
  }

  public async getOrder(id: string) {
    return this.http.get(
      `${this.baseUrl}/${id}`,
      this.getAdditionalOptionsRequestConfig()
    )
  }
}
