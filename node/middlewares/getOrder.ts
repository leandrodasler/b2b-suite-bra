import { ForbiddenError, UserInputError } from '@vtex/api'

import { checkPermissionAgainstOrder } from '../helpers'

const getOrder = async (context: Context) => {
  const {
    vtex: {
      route: {
        params: { orderId },
      },
    },
    clients: { omsClient },
    state: { userAndPermissions },
  } = context

  if (!orderId) {
    throw new UserInputError('Order ID is required')
  }

  const order = await omsClient.getOrder(String(orderId))

  if (!checkPermissionAgainstOrder(userAndPermissions, order)) {
    throw new ForbiddenError('Access denied')
  }

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  context.set('Cache-Control', 'max-age=86400')

  context.status = 200
  context.body = order
}

export default getOrder
