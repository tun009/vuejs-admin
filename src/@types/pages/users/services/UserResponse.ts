import { BaseListResponseModel } from '@/@types/common'
import { UserModel } from '..'

export type GetUserResponseModel = BaseListResponseModel<UserModel>
export type GetCheckerResponseModel = ApiResponseData<UserModel[]>
export type AddUserResponseModel = ApiResponseData<number>
export type UpdateUserResponseModel = ApiResponseData<number>
export type DeleteUserResponseModel = ApiResponseData<UserModel[]>
export type LockUserResponseModel = ApiResponseData<UserModel[]>
