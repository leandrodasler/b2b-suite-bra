import {
  getDistintClientAmount,
  getFirstDayInMonth,
  getGoal,
  getLastDayInMonth,
  getTotalValue,
} from '../helpers'

const getMonthlyOrders = async (
  context: Context,
  next: Next
): Promise<void> => {
  const {
    clients: { omsClient },
    state: { permissionQuery },
  } = context

  const intervalQuery = `f_creationDate=creationDate:[${getFirstDayInMonth()} TO ${getLastDayInMonth()}]`

  const [monthlyOrders, allOrders, goal] = await Promise.all([
    omsClient.search(
      `orderBy=creationDate,desc&${intervalQuery}&page=1&per_page=99999${permissionQuery}`
    ),
    omsClient.search(`page=1&per_page=99999${permissionQuery}`),
    getGoal(context),
  ])

  const totalValue = getTotalValue(monthlyOrders)
  const allOrdersDistinctClientAmount = getDistintClientAmount(allOrders)
  const monthlyOrdersDistinctClientAmount =
    getDistintClientAmount(monthlyOrders)

  const lastOrderId = allOrders.list[0]?.orderId ?? null

  context.set('Cache-Control', 'max-age=300')
  context.state.body = {
    totalValue,
    allOrdersDistinctClientAmount,
    monthlyOrdersDistinctClientAmount,
    lastOrderId,
    goal,
  }

  await next()
}

export default getMonthlyOrders
