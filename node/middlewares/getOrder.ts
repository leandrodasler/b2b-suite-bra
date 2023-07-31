/* eslint-disable no-console */
import type { ServiceContext } from '@vtex/api'
import { ForbiddenError, UserInputError } from '@vtex/api'

import type { Clients } from '../clients'
import { checkPermissionAgainstOrder, getUserAndPermissions } from '../helpers'

const getOrder = async (ctx: ServiceContext<Clients>) => {
  const {
    vtex: {
      route: {
        params: { orderId },
      },
    },
    clients: { omsClient },
  } = ctx

  if (!orderId) {
    throw new UserInputError('Order ID is required')
  }

  const order = await omsClient.getOrder(String(orderId))

  const { permissions, authEmail, profileEmail, organizationId, costCenterId } =
    await getUserAndPermissions(ctx)

  const permitted = checkPermissionAgainstOrder({
    permissions,
    orderData: order,
    authEmail,
    profileEmail,
    organizationId,
    costCenterId,
  })

  if (!permitted) {
    throw new ForbiddenError('Access denied')
  }

  ctx.set('Content-Type', 'application/json')
  ctx.set('Cache-Control', 'no-cache, no-store')

  ctx.response.body = order
  ctx.response.status = 200
}

export default getOrder
