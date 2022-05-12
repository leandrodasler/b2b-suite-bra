/* eslint-disable @typescript-eslint/prefer-interface */
export type LastOrdersProps = {
  limit: number
  orderDetailsPlacement: string
  orderDetailsPrimaryColor: string
}

export type RepresentativeAreaProps = {
  individualGoal: number
  reachedValue: number
  customersPortfolio: number
  customersOrdersMonth: number
}

export type Order = {
  orderId: string
  creationDate: string
  clientName: string
  status: OrderStatusType
  statusDescription: string
  salesChannel: string
  totalItems: number
  items: {
    id: string
    seller: string
    imageUrl: string
    name: string
    quantity: number
  }[]
}

export type User = {
  id: { value?: string }
  firstName?: { value?: string }
  lastName?: { value?: string }
  email?: { value?: string }
  organization?: string
  lastOrderId?: string
}

export const commonFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}

export const getOrders = async (limit: number): Promise<Order[]> => {
  const ordersResponse = await fetch(
    `/b2b/oms/user/orders/?page=1&per_page=${limit}`,
    commonFetchOptions
  )

  // eslint-disable-next-line prettier/prettier
  const orders: Order[] = (await ordersResponse.json())?.list

  const ordersDetailsResponse = await Promise.all(
    orders.map((order) =>
      fetch(`/b2b/oms/user/orders/${order.orderId}`, commonFetchOptions)
    )
  )

  const ordersDetails: Order[] = await Promise.all(
    ordersDetailsResponse.map((response) => response.json())
  )

  return ordersDetails?.length === orders?.length
    ? orders.map((order: Order, index: number) => ({
        ...order,
        ...ordersDetails[index],
      }))
    : orders
}

export const formatDate = (date: string): string => {
  const dateObject = new Date(date)
  const day = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(
    dateObject
  )

  const month = new Intl.DateTimeFormat('pt-BR', { month: '2-digit' }).format(
    dateObject
  )

  const year = dateObject.getFullYear()
  const hour = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit' }).format(
    dateObject
  )

  const minutes = new Intl.DateTimeFormat('pt-BR', {
    minute: '2-digit',
  }).format(dateObject)

  return `${day}/${month}/${year} às ${hour}:${minutes}`
}

const ORDER_STATUS_BACKGROUND_MAP = {
  'order-accepted': 'success',
  'order-created': 'success',
  cancel: 'error',
  'on-order-completed': 'success',
  'on-order-completed-ffm': 'success',
  'approve-payment': 'success',
  'payment-pending': 'warning',
  'request-cancel': 'error',
  canceled: 'error',
  'window-to-change-payment': 'warning',
  'window-to-change-seller': 'warning',
  'waiting-for-authorization': 'warning',
  'waiting-ffmt-authorization': 'warning',
  'waiting-for-manual-authorization': 'warning',
  'authorize-fulfillment': 'success',
  'window-to-cancel': 'warning',
  invoice: 'warning',
  invoiced: 'success',
  'ready-for-handling': 'success',
  'start-handling*': 'success',
  'cancellation-requested': 'error',
  handling: 'warning',
  'waiting-for-mkt-authorization': 'warning',
  'waiting-seller-handling': 'warning',
}

export type OrderStatusType = keyof typeof ORDER_STATUS_BACKGROUND_MAP

export const getOrderStatusTypeTag = (status: OrderStatusType): string =>
  ORDER_STATUS_BACKGROUND_MAP[status] || 'warning'

export const getUser = async (): Promise<User> => {
  const sessionResponse = await fetch(
    '/api/sessions?items=*',
    commonFetchOptions
  )

  const session = await sessionResponse.json()

  const organizationId =
    session?.namespaces['storefront-permissions']?.organization?.value

  return {
    ...session?.namespaces?.profile,
    organization: organizationId,
  }
}

export const getRemainingDaysInMonth = () => {
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return lastDay.getDate() - today.getDate()
}
