import type { ServiceContext } from '@vtex/api'
import { ForbiddenError } from '@vtex/api'

import type { Clients } from '../clients'

export const getPastYear = () => {
  const pastYear = new Date()

  pastYear.setDate(pastYear.getDate() - 365)

  return pastYear.toISOString()
}

export const getNow = () => new Date().toISOString()

export const getFirstDayInMonth = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)

  return firstDay.toISOString()
}

export const getLastDayInMonth = () => {
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

export const getUserAndPermissions = async (
  ctx: ServiceContext<Clients>
): Promise<UserAndPermissions> => {
  const {
    vtex: { storeUserAuthToken, sessionToken, logger },
    clients: { vtexIdClient, session, storefrontPermissionsClient },
  } = ctx

  const token = storeUserAuthToken

  if (!token) {
    throw new ForbiddenError('Access denied')
  }

  const authUser = await vtexIdClient.getAuthenticatedUser(token)

  const sessionData = await session
    .getSession(sessionToken as string, ['*'])
    .then(currentSession => {
      return currentSession.sessionData
    })
    .catch(error => {
      logger.error({
        error,
        message: 'orders-getSession-error',
      })

      return null
    })

  const userPermissions = await storefrontPermissionsClient
    .checkUserPermission('vtex.b2b-orders-history@0.x')
    .catch(error => {
      logger.error({
        message: 'checkUserPermission-error',
        error,
      })

      return {
        data: {
          checkUserPermission: null,
        },
      }
    })

  const profileEmail = sessionData?.namespaces?.profile?.email?.value

  const organizationId =
    sessionData?.namespaces?.['storefront-permissions']?.organization?.value

  const costCenterId =
    sessionData?.namespaces?.['storefront-permissions']?.costcenter?.value

  return {
    authEmail: authUser?.user,
    profileEmail,
    permissions: userPermissions?.data?.checkUserPermission?.permissions,
    organizationId,
    costCenterId,
  }
}

export const checkPermissionAgainstOrder = (
  userAndPermissions: UserAndPermissions,
  order: Order
) => {
  const { permissions, authEmail, profileEmail, organizationId, costCenterId } =
    userAndPermissions

  if (
    authEmail === order?.clientProfileData?.email ||
    profileEmail === order?.clientProfileData?.email
  ) {
    return true
  }

  if (permissions?.includes('all-orders')) {
    return true
  }

  if (
    permissions?.includes('organization-orders') &&
    organizationId === order?.marketingData?.utmCampaign
  ) {
    return true
  }

  if (
    permissions?.includes('costcenter-orders') &&
    costCenterId === order?.marketingData?.utmMedium
  ) {
    return true
  }

  return false
}

export const getDistintClientAmount = (orders: Orders) => {
  const distinctClients = orders.list.reduce(
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
