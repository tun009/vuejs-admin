import { UserInfoModel } from '..'

export type LoginResponseModel = ApiResponseData<{ token: string; refreshToken: string }>

export type UserInfoResponseModel = ApiResponseData<UserInfoModel>

export type LogoutResponseModel = ApiResponseData<boolean>
