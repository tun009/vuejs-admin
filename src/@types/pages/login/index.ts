import { RoleEnum } from '../users'

export interface BranchModel {
  id: number
  name: string
  code: string
}

export interface UserInfoModel {
  id: number
  name: string
  username: string
  phoneNumber: string
  role: RoleEnum
  branch: BranchModel
}

export interface LoginFormModel {
  username: string
  password: string
}
