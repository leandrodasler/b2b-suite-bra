import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import jwt from 'jsonwebtoken'

interface GoogleAuth {
  clientEmail: string
  privateKey: string
}

interface GoogleApiTokenResponse {
  access_token: string
}

const URL_BASE = 'https://www.googleapis.com/oauth2/v4'
const PATH_TOKEN = '/token'

const generateJWT = (auth: GoogleAuth, scope: string) => {
  const now = Math.floor(Date.now() / 1000)

  const token = {
    iss: auth.clientEmail,
    iat: now,
    exp: now + 3600,
    aud: `${URL_BASE}${PATH_TOKEN}`,
    scope,
  }

  return jwt.sign(token, auth.privateKey, { algorithm: 'RS256' })
}

export default class GoogleApiToken extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(URL_BASE, context, options)
  }

  public async getToken(auth: GoogleAuth, scope: string) {
    const signedJwt = generateJWT(auth, scope)

    const tokenParams = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt,
    })

    const tokenResponse = await this.http.post<GoogleApiTokenResponse>(
      PATH_TOKEN,
      tokenParams,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${signedJwt}`,
        },
      }
    )

    return tokenResponse.access_token
  }
}
