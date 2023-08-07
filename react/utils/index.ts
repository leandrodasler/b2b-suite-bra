declare global {
  interface Window {
    __RUNTIME__: {
      workspace: string
      account: string
    }
  }
}

export const {
  __RUNTIME__: { workspace, account },
} = window

export const commonFetchOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}

export const getLocale = () =>
  document.getElementsByTagName('html')[0].getAttribute('lang') || 'pt-BR'
