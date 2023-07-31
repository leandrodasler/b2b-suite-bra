import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class VtexId extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      params: {
        ...options?.params,
        workspace: context.workspace,
      },
    })
  }

  public async getAuthenticatedUser(authToken: string): Promise<{
    user: string
  }> {
    return this.http.get('/api/vtexid/pub/authenticated/user/', {
      params: { authToken },
      metric: 'authenticated-user-get',
    })
  }
}
