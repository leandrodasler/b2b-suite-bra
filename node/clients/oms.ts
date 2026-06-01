import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const BASE_URL = '/api/oms/user/orders'

export default class OMSClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.storeUserAuthToken ?? '',
      },
    })
  }

  private async get<T>(path: string) {
    return this.http.get<T>(`${BASE_URL}/${path}`)
  }

  public async search(query: string) {
    return this.http.get<Orders>(`${BASE_URL}?${query}`)
  }

  public async getOrder(id: string) {
    return this.get<Order>(id)
  }
}
