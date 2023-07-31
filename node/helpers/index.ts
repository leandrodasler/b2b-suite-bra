import type { ServiceContext } from '@vtex/api'
import { ForbiddenError } from '@vtex/api'

import type { Clients } from '../clients'

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

export const getUserAndPermissions = async (ctx: ServiceContext<Clients>) => {
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

  const {
    data: { checkUserPermission },
  } = await storefrontPermissionsClient
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
    permissions: checkUserPermission?.permissions,
    organizationId,
    costCenterId,
  }
}

interface OrderProfileData {
  clientProfileData: {
    email: string
  }
  marketingData: {
    utmCampaign: string
    utmMedium: string
  }
}

export const checkPermissionAgainstOrder = ({
  permissions,
  authEmail,
  profileEmail,
  organizationId,
  costCenterId,
  orderData,
}: {
  permissions?: string[]
  authEmail?: string
  profileEmail: string
  organizationId?: string
  costCenterId?: string
  orderData: OrderProfileData
}) => {
  if (
    authEmail === orderData?.clientProfileData?.email ||
    profileEmail === orderData?.clientProfileData?.email
  ) {
    return true
  }

  if (permissions?.includes('all-orders')) {
    return true
  }

  if (
    permissions?.includes('organization-orders') &&
    organizationId === orderData?.marketingData?.utmCampaign
  ) {
    return true
  }

  if (
    permissions?.includes('costcenter-orders') &&
    costCenterId === orderData?.marketingData?.utmMedium
  ) {
    return true
  }

  return false
}
