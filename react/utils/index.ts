/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import { RepresentativeAreaContextProps } from '../context/B2BContext'

export interface LastOrdersProps {
  limit: number
  orderDetailsPlacement: string
  orderDetailsPrimaryColor: string
}

export interface RepresentativeAreaProps {
  individualGoal: number
  reachedValue: number
  customersPortfolio: number
  customersOrdersMonth: number
}

export interface Order {
  orderId: string
  creationDate: string
  clientName: string
  status: OrderStatusType
  statusDescription: string
  salesChannel: string
  totalItems: number
  paymentApprovedDate?: Date
  items: {
    id: string
    seller: string
    imageUrl: string
    name: string
    quantity: number
  }[]
  totalValue: number
}

export const ROLE_MAP = {
  'store-admin': 'Administrador da Loja',
  'sales-admin': 'Administrador de Vendas',
  'sales-manager': 'Gerente de Vendas',
  'sales-representative': 'Representante de Vendas',
  'customer-admin': 'Administrador da Organização',
  'customer-approver': 'Aprovador da Organização',
  'customer-buyer': 'Comprador da Organização',
  default: '---',
}

export interface User {
  id: { value?: string }
  firstName?: { value?: string }
  lastName?: { value?: string }
  email?: { value?: string }
  b2bUserId?: string
  organization?: string
  costCenter?: string
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

  const orders: Order[] = (await ordersResponse.json())?.list || []

  const ordersDetailsResponse = await Promise.all(
    orders.map(order =>
      fetch(`/b2b/oms/user/orders/${order.orderId}`, commonFetchOptions)
    )
  )

  const ordersDetails: Order[] = await Promise.all(
    ordersDetailsResponse.map(response => response.json())
  )

  return ordersDetails?.length === orders?.length
    ? orders.map((order: Order, index: number) => ({
        ...order,
        ...ordersDetails[index],
      }))
    : orders
}

const getFirstDay = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  return firstDay.toISOString()
}

const getLastDay = () => {
  const now = new Date()
  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  )
  return lastDay.toISOString()
}

const getDistintClientAmount = (orders: Order[]) => {
  const distinctClients = orders.reduce(
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

export const getMonthlyOrders = async (): Promise<{
  totalValue: number
  monthlyOrdersDistinctClientAmount: number
  allOrdersDistinctClientAmount: number
}> => {
  const omsPvtOrdersResponse = await fetch(
    `/api/oms/pvt/orders/?creationDate,desc&f_creationDate=creationDate:[${getFirstDay()} TO ${getLastDay()}]&page=1&per_page=99999`,
    commonFetchOptions
  )

  const omsPvtOrders: Order[] = (await omsPvtOrdersResponse.json())?.list || []

  const allOrdersResponse = await fetch(
    `/b2b/oms/user/orders/?page=1&per_page=99999`,
    commonFetchOptions
  )
  const allOrders: Order[] = (await allOrdersResponse.json())?.list || []
  const allOrdersDistinctClientAmount = getDistintClientAmount(allOrders)

  // eslint-disable-next-line no-console
  console.log('Nº de clientes na carteira:', allOrdersDistinctClientAmount)

  // eslint-disable-next-line no-console
  console.log('All orders:', allOrders)

  const monthlyOrders = allOrders.filter(order =>
    omsPvtOrders.find(omsPvtOrder => omsPvtOrder.orderId === order.orderId)
  )

  // eslint-disable-next-line no-console
  console.log('Orders do mês: ', monthlyOrders)

  const totalValue = monthlyOrders
    .filter(order => order.paymentApprovedDate)
    .map(order => order.totalValue)
    .reduce((a: number, b: number) => a + b, 0)

  const monthlyOrdersDistinctClientAmount = getDistintClientAmount(
    monthlyOrders
  )
  // eslint-disable-next-line no-console
  console.log(
    'Nº de clientes que fizeram pedido este mês:',
    monthlyOrdersDistinctClientAmount
  )

  return {
    totalValue,
    monthlyOrdersDistinctClientAmount,
    allOrdersDistinctClientAmount,
  }
}

const getLocale = () =>
  document.getElementsByTagName('html')[0].getAttribute('lang') || 'pt-BR'

const getPercent = (current: number, total: number) => (current / total) * 100

export const getPercentReachedValue = (
  representativeArea: RepresentativeAreaContextProps
) =>
  getPercent(
    +representativeArea.reachedValue.value,
    +representativeArea.individualGoal.value ?? 1
  )

export const getPercentReachedValueInteger = (
  representativeArea: RepresentativeAreaContextProps
) => Math.floor(getPercentReachedValue(representativeArea))

export const getPercentReachedValueFormatted = (
  representativeArea: RepresentativeAreaContextProps
) => {
  const percentage = getPercentReachedValue(representativeArea)
  const locale = getLocale()
  return (percentage / 100).toLocaleString(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatDate = (date: string): string => {
  const dateObject = new Date(date)
  const language = getLocale()
  const formattedDate = new Intl.DateTimeFormat(language).format(dateObject)
  const formattedHour = new Intl.DateTimeFormat(language, {
    hour: 'numeric',
    minute: 'numeric',
  }).format(dateObject)

  return `${formattedDate} - ${formattedHour}`
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
  'start-handling': 'success',
  'cancellation-requested': 'error',
  handling: 'warning',
  'waiting-for-mkt-authorization': 'warning',
  'waiting-seller-handling': 'warning',
}

export type OrderStatusType = keyof typeof ORDER_STATUS_BACKGROUND_MAP

export const getOrderStatusTypeTag = (status: OrderStatusType): string =>
  ORDER_STATUS_BACKGROUND_MAP[status] || 'warning'

export async function getUser(): Promise<User> {
  let session
  while (!session?.namespaces['storefront-permissions']) {
    const sessionResponse = await fetch(
      '/api/sessions?items=*',
      commonFetchOptions
    )
    session = await sessionResponse.json()
    if (!session?.namespaces['storefront-permissions']) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const b2bUserId = session.namespaces['storefront-permissions'].userId?.value
  const organization =
    session.namespaces['storefront-permissions'].organization?.value
  const costCenter =
    session.namespaces['storefront-permissions'].costcenter?.value

  return {
    ...session?.namespaces?.profile,
    b2bUserId,
    organization,
    costCenter,
  }
}

// export async function getUser(): Promise<User> {
//   const sessionResponse = await fetch(
//     '/api/sessions?items=*',
//     commonFetchOptions
//   )

//   const session = await sessionResponse.json()

//   const b2bUserId = session?.namespaces['storefront-permissions']?.userId?.value
//   const organization =
//     session?.namespaces['storefront-permissions']?.organization?.value
//   const costCenter =
//     session?.namespaces['storefront-permissions']?.costcenter?.value

//   return {
//     ...session?.namespaces?.profile,
//     b2bUserId,
//     organization,
//     costCenter,
//   }
// }

export const useSessionUser = (): {
  user: User | undefined
  setUser: Dispatch<SetStateAction<User | undefined>>
  loading: boolean
} => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getUser().then(recoveredUser => {
      setUser(recoveredUser)
      setLoading(false)
    })
  }, [])

  return { user, setUser, loading }
}

// atribui valores na session que irão disparar o session transformer implementado
// em node/index.tsx na rota switchProfile
export async function setOrganizationUserSession(
  userId?: string,
  organization?: string,
  costCenter?: string
) {
  const response = await fetch('/api/sessions', {
    ...commonFetchOptions,
    body: JSON.stringify({
      public: {
        userId: { value: userId },
        organization: { value: organization },
        costcenter: { value: costCenter },
      },
    }),
    method: 'POST',
    credentials: 'same-origin',
  })

  return response
}

export const getRemainingDaysInMonth = () => {
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return lastDay.getDate() - today.getDate()
}

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

declare global {
  interface Window {
    __RUNTIME__: Record<string, unknown>
  }
}

export async function getGoal(organizationId: string): Promise<number> {
  try {
    const {
      __RUNTIME__: { account },
    } = window

    const response = await fetch(
      `https://b2bgoals--${account}.myvtex.com/_v/b2b-sales-representative-quotes/goal/${organizationId}`,
      { ...commonFetchOptions, credentials: undefined }
    )

    const goalResponse = await response.json()

    if (goalResponse.error) {
      console.error('Error getting goal:', goalResponse.error)
    }

    return goalResponse.goal
  } catch (error) {
    console.error('Error getting goal:', error)
    return 0
  }
}
