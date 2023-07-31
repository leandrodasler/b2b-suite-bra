import { IOClients } from '@vtex/api'

import OMS from './oms'
import StorefrontPermissions from './storefrontPermissions'
import VtexId from './vtexId'

export class Clients extends IOClients {
  public get omsClient() {
    return this.getOrSet('omsClient', OMS)
  }

  public get vtexIdClient() {
    return this.getOrSet('vtexIdClient', VtexId)
  }

  public get storefrontPermissionsClient() {
    return this.getOrSet('storefrontPermissionsClient', StorefrontPermissions)
  }
}
