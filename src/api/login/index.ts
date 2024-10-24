import { LoginRequestModel } from '@/@types/pages/login/services/LoginRequest'
import { LoginResponseModel, UserInfoResponseModel } from '@/@types/pages/login/services/LoginResponse'
import { request } from '@/api/service'

/** Log in and return token */
export function loginApi(data: LoginRequestModel) {
  return request<LoginResponseModel>({
    url: 'users/auth',
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
