import { getUserAndPermissions } from '../helpers'

const getPermissions = async (context: Context, next: Next) => {
  const userAndPermissions = await getUserAndPermissions(context)

  const { authEmail, organizationId, costCenterId, permissions } =
    userAndPermissions

  const permissionQuery = permissions?.includes('all-orders')
    ? ''
    : permissions?.includes('organization-orders')
    ? `&f_UtmCampaign=${organizationId}`
    : permissions?.includes('costcenter-orders')
    ? `&f_UtmMedium=${costCenterId}`
    : `&clientEmail=${authEmail}`

  context.state.userAndPermissions = userAndPermissions
  context.state.permissionQuery = permissionQuery

  await next()
}

export default getPermissions
