import { LoginRequestModel, RefreshTokenRequestModel } from '@/@types/pages/login/services/LoginRequest'
import {
  LoginResponseModel,
  LogoutResponseModel,
  UserInfoResponseModel
} from '@/@types/pages/login/services/LoginResponse'
import { request } from '@/api/service'

/** Log in and return token */
export function loginApi(data: LoginRequestModel) {
  return request<LoginResponseModel>({
    url: 'users/auth',
    method: 'post',
    data
  })
}

/** Refresh token and return token */
export function refreshTokenApi(data: RefreshTokenRequestModel) {
  return request<LoginResponseModel>(
    {
      url: 'users/refresh-token',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: undefined
      }
    },
    true
  )
}

/** Log out */
export function logoutApi(data: RefreshTokenRequestModel) {
  return request<LogoutResponseModel>({
    url: 'users/logout',
    method: 'post',
    data
  })
}

/** Get user details */
export function getUserInfoApi() {
  return request<UserInfoResponseModel>({
    url: 'users/me',
    method: 'get'
  })
}
