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
  items: Array<{
    id: string
    seller: string
    imageUrl: string
    name: string
    quantity: number
  }>
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
  authUserToken?: string
}

declare global {
  interface Window {
    __RUNTIME__: {
      workspace: string
      account: string
    }
  }
}

const {
  __RUNTIME__: { workspace, account },
} = window

export const commonFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}

export async function getUser(): Promise<User> {
  let session
  let count = 0

  while (!session?.namespaces['storefront-permissions'] && count <= 4) {
    count++
    const sessionResponse = await fetch(
      '/api/sessions?items=*',
      commonFetchOptions
    )
    session = await sessionResponse.json()
    if (!session?.namespaces['storefront-permissions']) {
      await new Promise(resolve => setTimeout(resolve, 250))
    }
  }

  const authUserToken =
    session?.namespaces['cookie']?.[`VtexIdclientAutCookie_${account}`]?.value
  const b2bUserId = session?.namespaces['storefront-permissions']?.userId?.value
  const organization =
    session?.namespaces['storefront-permissions']?.organization?.value
  const costCenter =
    session?.namespaces['storefront-permissions']?.costcenter?.value

  return {
    ...session?.namespaces?.profile,
    b2bUserId,
    organization,
    costCenter,
    authUserToken,
  }
}

export const getOrders = async (limit: number): Promise<Array<Order>> => {
  const ordersResponse = await fetch(
    `/_v/private/b2b-suite-bra/orders/?page=1&per_page=${limit}&workspace=${workspace}`,
    commonFetchOptions
  )

  const orders: Order[] = (await ordersResponse.json()) || []

  return orders
}

export const getMonthlyOrders = async (): Promise<{
  totalValue: number
  monthlyOrdersDistinctClientAmount: number
  allOrdersDistinctClientAmount: number
}> => {
  const monthlyOrdersResponse = await fetch(
    `/_v/private/b2b-suite-bra/monthly-orders?workspace=${workspace}`,
    commonFetchOptions
  )

  return monthlyOrdersResponse.json()
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

export async function getGoal(organizationId: string): Promise<number> {
  try {
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
