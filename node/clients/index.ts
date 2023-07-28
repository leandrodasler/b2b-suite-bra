import { IOClients } from '@vtex/api'
import { OMS } from '@vtex/clients'

import OMSClient from './OMSClient'

export class Clients extends IOClients {
  public get omsClient() {
    return this.getOrSet('omsClient', OMSClient)
  }

  public get oms() {
    return this.getOrSet('oms', OMS)
  }
}
