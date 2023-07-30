import { IOClients } from '@vtex/api'

import OMSClient from './OMSClient'

export class Clients extends IOClients {
  public get omsClient() {
    return this.getOrSet('omsClient', OMSClient)
  }
}
