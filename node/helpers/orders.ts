import type { Maybe } from '@vtex/api'

import { convertStringCurrencyToNumber } from './numbers'

const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

export const getTotalValue = (orders: Orders) =>
  orders.list
    .filter(order => order?.paymentApprovedDate)
    .map(order => order.totalValue)
    .reduce((a: number, b: number) => a + b, 0)

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

export const getGoal = async (context: Context) => {
  const {
    clients: { apps, googleApiTokenClient, googleSheetsClient },
    state: {
      userAndPermissions: { organizationId },
    },
  } = context

  const appSettings: Record<string, Maybe<string>> = await apps.getAppSettings(
    process.env.VTEX_APP_ID ?? ''
  )

  const googleSheetId = appSettings?.google_sheet_id
  const tabTitle = appSettings?.tab_title

  const defaultGoal = convertStringCurrencyToNumber(
    appSettings?.default_goal ?? '0'
  )

  const apiCredentials = JSON.parse(
    appSettings?.service_account_credentials_json ?? '{}'
  )

  const auth = {
    clientEmail: apiCredentials.client_email,
    privateKey: apiCredentials.private_key,
  }

  if (!googleSheetId || !auth.clientEmail || !auth.privateKey) {
    return defaultGoal
  }

  const token = await googleApiTokenClient.getToken(auth, GOOGLE_SHEETS_SCOPE)

  const sheetValues = await googleSheetsClient.getValues(
    token,
    googleSheetId,
    tabTitle
  )

  const foundGoal =
    convertStringCurrencyToNumber(
      sheetValues.find(rowValues => rowValues.organizationId === organizationId)
        ?.goal ?? '0'
    ) || defaultGoal

  return foundGoal
}
