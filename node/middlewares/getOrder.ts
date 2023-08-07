import { ForbiddenError, UserInputError } from '@vtex/api'

import { checkPermissionAgainstOrder } from '../helpers'

const getOrder = async (context: Context, next: Next) => {
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

  context.set('Cache-Control', 'max-age=86400')
  context.state.body = order

  await next()
}

export default getOrder
