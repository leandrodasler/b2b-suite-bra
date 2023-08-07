import { getNow, getPastYear } from '../helpers'

const getOrders = async (context: Context, next: Next) => {
  const {
    clients: { omsClient },
    request: { querystring },
    state: { permissionQuery },
  } = context

  const intervalQuery = `f_creationDate=creationDate:[${getPastYear()} TO ${getNow()}]`
  const query = `orderBy=creationDate,desc&${intervalQuery}&${querystring}${permissionQuery}`

  const orders = await omsClient.search(query)

  const ordersDetails = await Promise.all(
    orders.list.map(order => omsClient.getOrder(order.orderId))
  )

  const ordersWithDetails =
    ordersDetails.length === orders.list.length
      ? orders.list.map(order => ({
          ...order,
          ...ordersDetails.find(
            orderDetail => orderDetail.orderId === order.orderId
          ),
        }))
      : ordersDetails

  context.set('Cache-Control', 'max-age=300')
  context.state.body = ordersWithDetails

  await next()
}

export default getOrders
