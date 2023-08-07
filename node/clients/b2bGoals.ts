import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class B2bGoals extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://b2bgoals--${context.account}.myvtex.com/_v/b2b-sales-representative-quotes/goal`,
      context,
      options
    )
  }

  public async getGoal(organizationId: string) {
    return this.http.get<Goal>(`/${organizationId}`)
  }
}
