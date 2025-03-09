import { LonginTypeEnum } from '../../users'

export interface LoginRequestModel {
  grant_type?: LonginTypeEnum
  client_id?: number
  client_secret?: string
  username?: string
  password?: string
  code?: string
  redirect_url?: string
}

export interface RefreshTokenRequestModel {
  id: number
  refreshToken: string
}
export interface AuthorizeCodeRequestModel {
  client_id: number
  redirect_uri: string
  response_type: string
  scope?: string
  state: string
}
