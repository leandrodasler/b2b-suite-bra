import type { ServiceContext } from '@vtex/api'

import type { Clients } from '../clients'

const getMonthlyOrders = async (
  context: ServiceContext<Clients>
): Promise<void> => {
  const {
    clients: { omsClient },
  } = context

  let orders = null

  try {
    orders = await omsClient.getMonthlyOrders()
  } catch (error) {
    orders = {
      error: error?.message,
      stack: error?.toJSON()?.stack,
    }
  }

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  context.set('Access-Control-Max-Age', '86400')
  context.set('Cache-Control', 'no-cache')
  context.set('Content-Type', 'application/json')
  context.status = 200
  context.response.body = orders
}

export default getMonthlyOrders
