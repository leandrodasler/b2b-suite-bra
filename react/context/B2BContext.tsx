import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { createContext, FC, PropsWithChildren } from 'react'

import { useCurrentUser, User } from '../utils/user'

interface B2BContextType {
  user?: User
  loadingUser?: boolean
}

export const B2BContext = createContext<B2BContextType>({})

const B2BContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { user, isLoading: loadingUser } = useCurrentUser()

  return (
    <B2BContext.Provider value={{ user, loadingUser }}>
      {children}
    </B2BContext.Provider>
  )
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 10 } },
})

const B2BContextProviderWithQueryClient: FC<PropsWithChildren<unknown>> = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    <B2BContextProvider>{children}</B2BContextProvider>
  </QueryClientProvider>
)

export default B2BContextProviderWithQueryClient
