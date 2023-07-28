/* eslint-disable no-console */
import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class OMSClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com/api/oms/pvt/orders`, context, {
      ...options,
      params: {
        ...options?.params,
        workspace: context.workspace,
      },
      headers: {
        ...options?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        VtexIdclientAutCookie:
          context.storeUserAuthToken ?? context.authToken ?? '',
      },
    })
  }

  public async getOrdersByLimit(limit: number, authCookie: string) {
    console.log('authCookie', authCookie)
    // console.log('context.segmentToken', this.context.segmentToken)
    // console.log('context.sessionToken', this.context.sessionToken)

    if (super.options?.headers) {
      super.options.headers.VtexIdclientAutCookie = authCookie
    }

    return this.http.get(`/?page=1&per_page=${limit}`)
  }

  public async getOrder(id: string) {
    return this.http.get(`/${id}`)
  }
}
