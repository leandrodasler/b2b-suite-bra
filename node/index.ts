import type { ClientsConfig } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import getMonthlyOrders from './middlewares/getMonthlyOrders'
import getOrder from './middlewares/getOrder'
import getOrders from './middlewares/getOrders'
import setApiSettings from './middlewares/setApiSettings'

const TIMEOUT_MS = 4 * 1000
const CONCURRENCY = 10
const memoryCache = new LRUCache<string, never>({ max: 5000 })

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
    },
    status: {
      memoryCache,
    },
  },
}

export default new Service({
  clients,
  routes: {
    monthlyOrders: method({
      GET: [setApiSettings, getMonthlyOrders],
    }),
    orders: method({
      GET: [setApiSettings, getOrders],
    }),
    order: method({
      GET: [setApiSettings, getOrder],
    }),
  },
})
