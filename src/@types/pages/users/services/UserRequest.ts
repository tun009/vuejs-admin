import { PaginationModel } from '@/@types/common'
import { FilterUserModel, RoleEnum } from '..'

export interface GetUserRequestModel extends PaginationModel, Partial<FilterUserModel> {}

export interface AddUserRequestModel {
  name: string
  username: string
  branchId: string
  role: RoleEnum
}
