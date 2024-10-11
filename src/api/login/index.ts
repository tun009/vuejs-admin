import { request } from '@/api/service'
import type * as Login from './types/login'

/** Get login verification code */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: 'login/code',
    method: 'get'
  })
}

/** Log in and return token */
// export function loginApi(data: Login.LoginRequestData) {
// return request<Login.LoginResponseData>({
//   url: 'users/login',
//   method: 'post',
//   data
// })
// }

export function loginApi(_data: Login.LoginRequestData): Promise<Login.LoginResponseData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          token: 'admin-token'
        },
        message: 'Meo'
      })
    }, 2000)
  })
}

/** Get user details */
// export function getUserInfoApi() {
//   return request<Login.UserInfoResponseData>({
//     url: 'users/info',
//     method: 'get'
//   })
// }

export function getUserInfoApi(): Promise<Login.UserInfoResponseData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 0,
        data: {
          username: 'admin',
          roles: ['admin']
        },
        message: 'Meo'
      })
    }, 2000)
  })
}
