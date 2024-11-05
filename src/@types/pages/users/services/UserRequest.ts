import { PaginationModel } from '@/@types/common'
import { FilterUserModel, RoleEnum } from '..'

export interface GetUserRequestModel extends PaginationModel, Partial<FilterUserModel> {}

export interface AddUserRequestModel {
  name: string
  username: string
  branchId: number
  role: RoleEnum
}

export interface UpdateUserRequestModel {
  username: string | number | undefined
  id: number
  name: string
  branchId: number
  role: RoleEnum
  status: any
}
