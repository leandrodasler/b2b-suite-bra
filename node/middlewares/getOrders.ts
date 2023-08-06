import { getNow, getPastYear } from '../helpers'

const getOrders = async (context: Context) => {
  const {
    clients: { omsClient },
    request: { querystring },
    state: { permissionQuery },
  } = context

  const intervalQuery = `f_creationDate=creationDate:[${getPastYear()} TO ${getNow()}]`
  const query = `orderBy=creationDate,desc&${intervalQuery}&${querystring}${permissionQuery}`

  const orders = await omsClient.search(query)

  const ordersDetails = await Promise.all(
    orders.list.map(async order => omsClient.getOrder(order.orderId))
  )

  const ordersWithDetails =
    ordersDetails.length === orders.list.length
      ? orders.list.map((order, index) => ({
          ...order,
          ...ordersDetails[index],
        }))
      : ordersDetails

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  context.set('Cache-Control', 'max-age=300')

  context.status = 200
  context.body = ordersWithDetails
}

export default getOrders
