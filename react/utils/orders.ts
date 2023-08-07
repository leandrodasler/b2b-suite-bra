import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { commonFetchOptions, workspace } from '.'

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
  'start-handling': 'success',
  'cancellation-requested': 'error',
  handling: 'warning',
  'waiting-for-mkt-authorization': 'warning',
  'waiting-seller-handling': 'warning',
}

export type OrderStatusType = keyof typeof ORDER_STATUS_BACKGROUND_MAP

interface Order {
  orderId: string
  creationDate: string
  clientName: string
  status: OrderStatusType
  statusDescription: string
  salesChannel: string
  totalItems: number
  paymentApprovedDate?: Date
  items: Array<{
    id: string
    seller: string
    imageUrl: string
    name: string
    quantity: number
  }>
  totalValue: number
}

interface MonthlyOrders {
  goal: number
  totalValue: number
  monthlyOrdersDistinctClientAmount: number
  allOrdersDistinctClientAmount: number
  lastOrderId: string
}

export const getOrders = async (limit: number): Promise<Order[]> => {
  const ordersResponse = await fetch(
    `/_v/private/b2b-suite-bra/orders/?page=1&per_page=${limit}&workspace=${workspace}`,
    commonFetchOptions
  )

  if (!ordersResponse.ok) {
    throw new Error(
      (await ordersResponse.json()).message ?? 'Error fetching orders'
    )
  }

  return ordersResponse.json()
}

export const useLastOrders = (limit: number) => {
  const { data: orders, isLoading, error } = useQuery<
    Order[] | undefined,
    Error
  >({
    queryKey: ['last-orders', String(limit), workspace],
    queryFn: async () => getOrders(limit),
  })

  return { orders, isLoading, error }
}

export const getMonthlyOrders = async (): Promise<MonthlyOrders> => {
  const monthlyOrdersResponse = await fetch(
    `/_v/private/b2b-suite-bra/monthly-orders?workspace=${workspace}`,
    commonFetchOptions
  )

  if (!monthlyOrdersResponse.ok) {
    throw new Error(
      (await monthlyOrdersResponse.json()).message ??
        'Error fetching monthly orders'
    )
  }

  return monthlyOrdersResponse.json()
}

export const useMonthlyOrders = () => {
  const { data: monthlyOrders, isLoading, error } = useQuery<
    MonthlyOrders | undefined,
    Error
  >({
    queryKey: ['monthly-orders', workspace],
    queryFn: getMonthlyOrders,
  })

  return { monthlyOrders, isLoading, error }
}

export const getOrderStatusTypeTag = (status: OrderStatusType): string =>
  ORDER_STATUS_BACKGROUND_MAP[status] || 'warning'

export const useFormattedStatus = () => {
  const intl = useIntl()

  const formatStatus = useMemo(
    () => (status: OrderStatusType) =>
      intl.formatMessage({
        id: `store/order-status.${status}`,
        defaultMessage: status,
      }),
    [intl]
  )

  return formatStatus
}
