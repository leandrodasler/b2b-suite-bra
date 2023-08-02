/* eslint-disable no-console */
import type { ServiceContext } from '@vtex/api'
import { ForbiddenError, UserInputError } from '@vtex/api'

import type { Clients } from '../clients'
import { checkPermissionAgainstOrder, getUserAndPermissions } from '../helpers'

const getOrder = async (context: ServiceContext<Clients>) => {
  const {
    vtex: {
      route: {
        params: { orderId },
      },
    },
    clients: { omsClient },
  } = context

  if (!orderId) {
    throw new UserInputError('Order ID is required')
  }

  const order = await omsClient.getOrder(String(orderId))

  const { permissions, authEmail, profileEmail, organizationId, costCenterId } =
    await getUserAndPermissions(context)

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

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  // ctx.set('Cache-Control', 'no-cache, no-store')

  context.response.status = 200
  context.response.body = order
}

export default getOrder
