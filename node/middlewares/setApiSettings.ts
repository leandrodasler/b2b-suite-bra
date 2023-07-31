import type { ServiceContext } from '@vtex/api'

import type { Clients } from '../clients'

const setApiSettings = async (
  context: ServiceContext<Clients>,
  next: () => Promise<void>
) => {
  const {
    clients: { apps, omsClient },
  } = context

  const appSettings = await apps.getAppSettings(process.env.VTEX_APP_ID ?? '')
  const apiKey = appSettings['X-VTEX-API-AppKey'] as string
  const apiToken = appSettings['X-VTEX-API-AppToken'] as string

  omsClient.setApiSettings(apiKey, apiToken)

  await next()
}

export default setApiSettings
