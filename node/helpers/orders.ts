export const getTotalValue = (orders: Orders) =>
  orders.list
    .filter(order => order?.paymentApprovedDate)
    .map(order => order.totalValue)
    .reduce((a: number, b: number) => a + b, 0)

export const getDistintClientAmount = (orders: Orders) => {
  const distinctClients = orders.list.reduce(
    (clients: Record<string, number>, order) => {
      if (order.clientName in clients) {
        clients[order.clientName]++
      } else {
        clients[order.clientName] = 1
      }

      return clients
    },
    {}
  )

  return Object.keys(distinctClients).length
}
