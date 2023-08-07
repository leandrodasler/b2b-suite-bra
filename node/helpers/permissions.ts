import type { ServiceContext } from '@vtex/api'
import { ForbiddenError } from '@vtex/api'

import type { Clients } from '../clients'

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
