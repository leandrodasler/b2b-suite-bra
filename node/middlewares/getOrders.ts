import type { ServiceContext } from '@vtex/api'

import type { Clients } from '../clients'

const getOrders = async (context: ServiceContext<Clients>): Promise<void> => {
  const {
    clients: { omsClient /* , oms */ },
    query: { storeUserAuthToken },
    // vtex: {
    //   route: {
    //     params: { sellerId },
    //   },
    // },
  } = context

  // eslint-disable-next-line no-console
  console.log('storeUserAuthToken', storeUserAuthToken)

  context.response.body = await omsClient.getOrdersByLimit(
    999,
    storeUserAuthToken ?? ''
  )
  // context.response.body = await oms.listOrders('STORE_TOKEN')
  context.status = 200
}

export default getOrders
