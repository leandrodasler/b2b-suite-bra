import {
  getDistintClientAmount,
  getFirstDayInMonth,
  getLastDayInMonth,
} from '../helpers'

const getMonthlyOrders = async (context: Context): Promise<void> => {
  const {
    clients: { omsClient },
    state: { permissionQuery },
  } = context

  const intervalQuery = `f_creationDate=creationDate:[${getFirstDayInMonth()} TO ${getLastDayInMonth()}]`
  const monthlyOrders = await omsClient.search(
    `orderBy=creationDate,desc&${intervalQuery}&page=1&per_page=99999${permissionQuery}`
  )

  const allOrders = await omsClient.search(
    `page=1&per_page=99999${permissionQuery}`
  )

  const totalValue = monthlyOrders.list
    .filter(order => order?.paymentApprovedDate)
    .map(order => order.totalValue)
    .reduce((a: number, b: number) => a + b, 0)

  const allOrdersDistinctClientAmount = getDistintClientAmount(allOrders)

  const monthlyOrdersDistinctClientAmount =
    getDistintClientAmount(monthlyOrders)

  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  context.set('Cache-Control', 'max-age=300')

  context.status = 200
  context.body = {
    totalValue,
    monthlyOrdersDistinctClientAmount,
    allOrdersDistinctClientAmount,
  }
}

export default getMonthlyOrders
