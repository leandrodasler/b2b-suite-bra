import {
  ClientsConfig,
  LRUCache,
  method,
  Service,
  ServiceContext,
} from '@vtex/api'
import { json } from 'co-body'
// import { Clients } from './clients'
// import { getPromotions } from './handlers/getPromotions'

const TIMEOUT_MS = 800
const memoryCache = new LRUCache<string, never>({ max: 5000 })

const clients: ClientsConfig = {
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

export default new Service({
  clients,
  routes: {
    status: method({
      GET: (ctx: ServiceContext) => {
        console.log(ctx)
      },
    }),
    switchProfile: method({
      POST: async (ctx: ServiceContext) => {
        const { req, response } = ctx
        const body = await json(req)

        console.log('switch profile to: ', body)

        ctx.set('Content-Type', 'application/json')
        ctx.set('Cache-Control', 'no-cache, no-store')

        response.body = {
          'storefront-permissions': {
            costcenter: {
              value: body.public.costcenter.value,
            },
            organization: {
              value: body.public.organization.value,
            },
            userId: {
              value: body.public.userId.value,
            },
          },
        }

        response.status = 200
      },
    }),
  },
})
