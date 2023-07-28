import type { ClientsConfig } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import getOrders from './middlewares/getOrders'
// import { json } from 'co-body'
// import { Clients } from './clients'
// import { getPromotions } from './handlers/getPromotions'

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
    orders: method({
      GET: getOrders,
    }),
    // switchProfile: method({
    //   POST: async (ctx: ServiceContext) => {
    //     const {
    //       req,
    //       response,
    //       vtex: { logger },
    //     } = ctx

    //     const body = await json(req)
    //     const logMessage = `switch profile to: ${JSON.stringify(body)}`

    //     console.log(logMessage)
    //     logger.info({
    //       message: logMessage,
    //     })

    //     ctx.set('Content-Type', 'application/json')
    //     ctx.set('Cache-Control', 'no-cache, no-store')

    //     response.body = {
    //       'storefront-permissions': {
    //         costcenter: {
    //           value: body.public.costcenter.value,
    //         },
    //         organization: {
    //           value: body.public.organization.value,
    //         },
    //         userId: {
    //           value: body.public.userId.value,
    //         },
    //       },
    //     }

    //     response.status = 200
    //   },
    // }),
  },
})
