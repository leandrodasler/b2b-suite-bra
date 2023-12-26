import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { defineMessages, useIntl } from 'react-intl'

import { commonFetchOptions, workspace } from '.'

const ORDER_STATUS_BACKGROUND_MAP = {
  'order-accepted': 'success',
  'order-created': 'success',
  cancel: 'error',
  'on-order-completed': 'success',
  'on-order-completed-ffm': 'success',
  'approve-payment': 'success',
  'payment-pending': 'warning',
  'payment-approved': 'success',
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
  lastValues: Array<{
    month: number
    value: number
  }>
  productAmountMap: Record<string, number>
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
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[] | undefined, Error>({
    queryKey: ['last-orders', String(limit), workspace],
    queryFn: async () => getOrders(limit),
  })

  return { orders, isLoading, error }
}

export const getMonthlyOrders = async (
  reachedValueHistoryMonths: number
): Promise<MonthlyOrders> => {
  const monthlyOrdersResponse = await fetch(
    `/_v/private/b2b-suite-bra/monthly-orders?reachedValueHistoryMonths=${reachedValueHistoryMonths}&workspace=${workspace}`,
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

export const useMonthlyOrders = (reachedValueHistoryMonths: number) => {
  const {
    data: monthlyOrders,
    isLoading,
    error,
  } = useQuery<MonthlyOrders | undefined, Error>({
    queryKey: ['monthly-orders', workspace, reachedValueHistoryMonths],
    queryFn: async () => getMonthlyOrders(reachedValueHistoryMonths),
  })

  return { monthlyOrders, isLoading, error }
}

export const getOrderStatusTypeTag = (status: OrderStatusType): string =>
  ORDER_STATUS_BACKGROUND_MAP[status] || 'warning'

const statusMessages = defineMessages({
  'order-accepted': { id: 'store/order-status.order-accepted' },
  'order-created': { id: 'store/order-status.order-created' },
  cancel: { id: 'store/order-status.cancel' },
  'on-order-completed': { id: 'store/order-status.on-order-completed' },
  'on-order-completed-ffm': { id: 'store/order-status.on-order-completed-ffm' },
  'approve-payment': { id: 'store/order-status.approve-payment' },
  'payment-pending': { id: 'store/order-status.payment-pending' },
  'payment-approved': { id: 'store/order-status.payment-approved' },
  'request-cancel': { id: 'store/order-status.request-cancel' },
  canceled: { id: 'store/order-status.canceled' },
  'window-to-change-payment': {
    id: 'store/order-status.window-to-change-payment',
  },
  'window-to-change-seller': {
    id: 'store/order-status.window-to-change-seller',
  },
  'waiting-for-authorization': {
    id: 'store/order-status.waiting-for-authorization',
  },
  'waiting-ffmt-authorization': {
    id: 'store/order-status.waiting-ffmt-authorization',
  },
  'waiting-for-manual-authorization': {
    id: 'store/order-status.waiting-for-manual-authorization',
  },
  'authorize-fulfillment': { id: 'store/order-status.authorize-fulfillment' },
  'window-to-cancel': { id: 'store/order-status.window-to-cancel' },
  invoice: { id: 'store/order-status.invoice' },
  invoiced: { id: 'store/order-status.invoiced' },
  'ready-for-handling': { id: 'store/order-status.ready-for-handling' },
  'start-handling': { id: 'store/order-status.start-handling' },
  'cancellation-requested': { id: 'store/order-status.cancellation-requested' },
  handling: { id: 'store/order-status.handling' },
  'waiting-for-mkt-authorization': {
    id: 'store/order-status.waiting-for-mkt-authorization',
  },
  'waiting-seller-handling': {
    id: 'store/order-status.waiting-seller-handling',
  },
})

export const useFormattedStatus = () => {
  const intl = useIntl()

  const formatStatus = useMemo(
    () => (status: OrderStatusType) =>
      intl.formatMessage({ ...statusMessages[status], defaultMessage: status }),
    [intl]
  )

  return formatStatus
}
