import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const BASE_URL = '/api/oms/pvt/orders'

export default class OMSClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  private async get<T>(path: string) {
    return this.http.get<T>(`${BASE_URL}/${path}`)
  }

  public async search(query: string) {
    return this.get<Orders>(`?${query}`)
  }

  public async getOrder(id: string) {
    return this.get<Order>(id)
  }
}
