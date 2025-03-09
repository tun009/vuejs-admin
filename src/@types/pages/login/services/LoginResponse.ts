import { UserInfoModel } from '..'

export type LoginResponseModel = ApiResponseData<any>

export type UserInfoResponseModel = ApiResponseData<UserInfoModel>

export type LogoutResponseModel = ApiResponseData<boolean>
