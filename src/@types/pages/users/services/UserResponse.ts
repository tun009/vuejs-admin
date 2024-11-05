import { BaseListResponseModel } from '@/@types/common'
import { UserModel } from '..'

export type GetUserResponseModel = BaseListResponseModel<UserModel>
export type GetCheckerResponseModel = ApiResponseData<UserModel[]>
export type AddUserResponseModel = ApiResponseData<number>
