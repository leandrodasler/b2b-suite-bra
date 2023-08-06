import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import getPermission from '../queries/getPermission'

export default class StorefrontPermissions extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.storefront-permissions@1.x', ctx, options)
  }

  public checkUserPermission = async (app?: string) => {
    return this.graphql.query<UserPermissions, Record<string, unknown>>({
      extensions: {
        persistedQuery: {
          provider: 'vtex.storefront-permissions@1.x',
          sender: app ?? 'vtex.b2b-organizations@0.x',
        },
      },
      query: getPermission,
      variables: {},
    })
  }
}
