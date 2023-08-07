import { useQuery } from '@tanstack/react-query'

import { account, commonFetchOptions } from '.'

export interface User {
  id: { value?: string }
  firstName?: { value?: string }
  lastName?: { value?: string }
  email?: { value?: string }
  b2bUserId?: string
  organization?: string
  costCenter?: string
  authUserToken?: string
}

export const getUser = async (): Promise<User> => {
  const sessionResponse = await fetch(
    `/api/sessions?items=*`,
    commonFetchOptions
  )

  if (!sessionResponse.ok) {
    throw new Error(
      (await sessionResponse.json()).message ?? 'Error fetching user'
    )
  }

  const session = await sessionResponse.json()

  if (!session?.namespaces['storefront-permissions']) {
    throw new Error('Error fetching user organization data')
  }

  const authUserToken =
    session?.namespaces['cookie']?.[`VtexIdclientAutCookie_${account}`]?.value
  const b2bUserId = session?.namespaces['storefront-permissions']?.userId?.value
  const organization =
    session?.namespaces['storefront-permissions']?.organization?.value
  const costCenter =
    session?.namespaces['storefront-permissions']?.costcenter?.value

  return {
    ...session?.namespaces?.profile,
    b2bUserId,
    organization,
    costCenter,
    authUserToken,
  }
}

export const useCurrentUser = () => {
  const { data: user, isLoading, error } = useQuery<User, Error>({
    queryKey: ['get-user'],
    queryFn: getUser,
  })

  return { user, isLoading, error }
}
