import { PaginationModel } from '@/@types/common'
import { FilterUserModel, RoleEnum, UserStatusEnum } from '..'

export interface GetUserRequestModel extends PaginationModel, Partial<FilterUserModel> {}

export interface AddUserRequestModel {
  name: string
  username: string
  branchId?: number
  role: RoleEnum
}

export interface UpdateUserRequestModel {
  username: string | number | undefined
  id: number
  name: string
  branchId: number
  role: RoleEnum
  status: UserStatusEnum
}

export interface UpdateUserFormModel extends Omit<UpdateUserRequestModel, 'status'> {
  status: boolean
}
