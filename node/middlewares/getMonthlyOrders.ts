import { UserInputError } from '@vtex/api'

import {
  getDistintClientAmount,
  getFirstDayInMonth,
  getGoal,
  getLastDayInMonth,
  getMonthByNegativeShift,
  getProductAmountMap,
  getTotalValue,
} from '../helpers'

const getMonthlyOrders = async (
  context: Context,
  next: Next
): Promise<void> => {
  const {
    clients: { omsClient },
    state: { permissionQuery },
    query: { reachedValueHistoryMonths },
  } = context

  if (reachedValueHistoryMonths && Object.is(+reachedValueHistoryMonths, NaN)) {
    throw new UserInputError('reachedValueHistoryMonths must be a number')
  }

  const lastSixMonthsQueries = []

  if (reachedValueHistoryMonths) {
    for (let i = 1; i < +reachedValueHistoryMonths; i++) {
      lastSixMonthsQueries.push(
        `f_creationDate=creationDate:[${getFirstDayInMonth(
          i
        )} TO ${getLastDayInMonth(i)}]`
      )
    }
  }

  const intervalQuery = `f_creationDate=creationDate:[${getFirstDayInMonth()} TO ${getLastDayInMonth()}]`

  const [[monthlyOrders, allOrders, goal], lastMonthOrders] = await Promise.all(
    [
      Promise.all([
        omsClient.search(
          `orderBy=creationDate,desc&${intervalQuery}&page=1&per_page=99999${permissionQuery}`
        ),
        omsClient.search(`page=1&per_page=99999${permissionQuery}`),
        getGoal(context),
      ]),
      Promise.all(
        lastSixMonthsQueries.map(query =>
          omsClient.search(
            `orderBy=creationDate,desc&${query}&page=1&per_page=99999${permissionQuery}`
          )
        )
      ),
    ]
  )

  const totalValue = getTotalValue(monthlyOrders)

  const lastValues = lastMonthOrders
    .map((orders, index) => ({
      month: getMonthByNegativeShift(index + 1),
      value: getTotalValue(orders),
    }))
    .reverse()

  lastValues.push({
    month: getMonthByNegativeShift(0),
    value: totalValue,
  })

  const allOrdersDistinctClientAmount = getDistintClientAmount(allOrders)
  const monthlyOrdersDistinctClientAmount =
    getDistintClientAmount(monthlyOrders)

  const lastOrderId = allOrders.list[0]?.orderId ?? null

  const richAllOrders = await Promise.all(
    allOrders.list.map(order => omsClient.getOrder(order.orderId))
  )

  const productAmountMap = getProductAmountMap(richAllOrders)

  context.set('Cache-Control', 'max-age=300')
  context.state.body = {
    totalValue,
    lastValues,
    productAmountMap,
    allOrdersDistinctClientAmount,
    monthlyOrdersDistinctClientAmount,
    lastOrderId,
    goal,
  }

  await next()
}

export default getMonthlyOrders
