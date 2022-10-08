import { Dispatch, SetStateAction, useEffect, useState } from 'react'

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
  items: {
    id: string
    seller: string
    imageUrl: string
    name: string
    quantity: number
  }[]
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

export async function getUser(): Promise<User> {
  const sessionResponse = await fetch(
    '/api/sessions?items=*',
    commonFetchOptions
  )

  const session = await sessionResponse.json()

  const b2bUserId = session?.namespaces['storefront-permissions']?.userId?.value

  return {
    ...session?.namespaces?.profile,
    b2bUserId,
  }
}

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
