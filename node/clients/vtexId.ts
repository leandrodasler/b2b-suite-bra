import { JanusClient } from '@vtex/api'

export default class VtexId extends JanusClient {
  public async getAuthenticatedUser(authToken: string): Promise<{
    user: string
  }> {
    return this.http.get('/api/vtexid/pub/authenticated/user/', {
      params: { authToken },
      metric: 'authenticated-user-get',
    })
  }
}
