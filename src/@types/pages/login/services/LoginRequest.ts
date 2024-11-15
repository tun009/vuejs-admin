export interface LoginRequestModel {
  username: string
  password: string
}

export interface RefreshTokenRequestModel {
  id: number
  refreshToken: string
}
