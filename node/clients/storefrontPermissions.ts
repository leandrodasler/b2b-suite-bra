import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import getPermission from '../queries/getPermission'

interface UserPermissions {
  data: {
    checkUserPermission: {
      permissions?: string[]
    }
  }
}

export default class StorefrontPermissions extends AppGraphQLClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super('vtex.storefront-permissions@1.x', ctx, {
      ...options,
      params: {
        ...options?.params,
        workspace: ctx.workspace,
      },
    })
  }

  public checkUserPermission = async (
    app?: string
  ): Promise<UserPermissions> => {
    return this.graphql.query(
      {
        extensions: {
          persistedQuery: {
            provider: 'vtex.storefront-permissions@1.x',
            sender: app ?? 'vtex.b2b-organizations@0.x',
          },
        },
        query: getPermission,
        variables: {},
      },
      {}
    ) as Promise<UserPermissions>
  }
}
