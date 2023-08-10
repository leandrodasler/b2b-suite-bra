import { IOClients } from '@vtex/api'

import GoogleApiToken from './googleApiToken'
import GoogleSheets from './googleSheets'
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

  public get googleApiTokenClient() {
    return this.getOrSet('googleApiTokenClient', GoogleApiToken)
  }

  public get googleSheetsClient() {
    return this.getOrSet('googleSheetsClient', GoogleSheets)
  }
}
