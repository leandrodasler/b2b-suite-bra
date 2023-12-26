declare global {
  interface Window {
    __RUNTIME__: {
      workspace: string
      account: string
      culture: {
        locale: string
      }
    }
  }
}

export const {
  __RUNTIME__: {
    workspace,
    account,
    culture: { locale },
  },
} = window

export const commonFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}

export const getLocale = () => locale
