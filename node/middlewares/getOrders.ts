import type { ServiceContext } from '@vtex/api'

import type { Clients } from '../clients'
import { getUserAndPermissions } from '../helpers'

const getOrders = async (ctx: ServiceContext<Clients>) => {
  const {
    clients: { omsClient },
    request: { querystring },
  } = ctx

  const { authEmail, organizationId, costCenterId, permissions } =
    await getUserAndPermissions(ctx)

  const filterByPermission = (userPermissions: string[]) => {
    if (userPermissions.includes('all-orders')) {
      return ``
    }

    if (userPermissions.includes('organization-orders')) {
      return `&f_UtmCampaign=${organizationId}`
    }

    if (userPermissions.includes('costcenter-orders')) {
      return `&f_UtmMedium=${costCenterId}`
    }

    return `&clientEmail=${authEmail}`
  }

  const pastYear = new Date()

  pastYear.setDate(pastYear.getDate() - 365)

  const now = new Date().toISOString()
  let query = `f_creationDate=creationDate:[${pastYear.toISOString()} TO ${now}]&${querystring}`

  if (permissions?.length) {
    query += filterByPermission(permissions)
  } else {
    query += `&clientEmail=${authEmail}`
  }

  const orders = await omsClient.search(query)

  ctx.set('Content-Type', 'application/json')
  ctx.set('Cache-Control', 'no-cache, no-store')
  ctx.response.body = orders
  ctx.response.status = 200
}

export default getOrders
