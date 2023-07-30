import type { ClientsConfig } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import getMonthlyOrders from './middlewares/getMonthlyOrders'

const TIMEOUT_MS = 3 * 1000
const CONCURRENCY = 10
const memoryCache = new LRUCache<string, never>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 2,
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
      GET: getMonthlyOrders,
    }),
  },
})
