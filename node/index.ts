import type {
  Cached,
  ClientsConfig,
  RecorderState,
  ServiceContext,
} from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'
import type {
  ListOrdersItem,
  ListOrdersResponse,
  OrderDetailResponse,
} from '@vtex/clients'

import { Clients } from './clients'
import getMonthlyOrders from './middlewares/getMonthlyOrders'
import getOrder from './middlewares/getOrder'
import getOrders from './middlewares/getOrders'
import getPermissions from './middlewares/getPermissions'
import setResponse from './middlewares/setResponse'
import getAllTaxes from './middlewares/getAllTaxes'

const TIMEOUT_MS = 4 * 1000
const CONCURRENCY = 10
const memoryCache = new LRUCache<string, Cached>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 100,
      retries: 10,
      timeout: TIMEOUT_MS,
      concurrency: CONCURRENCY,
      memoryCache,
    },
  },
}

declare global {
  interface UserPermissions {
    checkUserPermission: {
      permissions?: string[]
    }
  }

  interface UserAndPermissions {
    authEmail: string
    profileEmail: string
    organizationId: string
    costCenterId: string
    permissions?: string[]
  }

  interface OrdersItem extends ListOrdersItem {
    paymentApprovedDate?: Date
  }

  interface Orders extends ListOrdersResponse {
    list: OrdersItem[]
  }

  type Order = OrderDetailResponse & OrdersItem

  interface Goal {
    success: boolean
    organizationId: string
    goal: number
  }

  interface State extends RecorderState {
    userAndPermissions: UserAndPermissions
    permissionQuery: string
    body: unknown
  }

  type Context = ServiceContext<Clients, State>

  type Next = () => Promise<void>
}

export default new Service({
  clients,
  routes: {
    monthlyOrders: method({
      GET: [getPermissions, getMonthlyOrders, setResponse],
    }),
    orders: method({
      GET: [getPermissions, getOrders, setResponse],
    }),
    order: method({
      GET: [getPermissions, getOrder, setResponse],
    }),
    getAllTaxes: method({
      GET: [getAllTaxes, setResponse],
    }),
  },
})
