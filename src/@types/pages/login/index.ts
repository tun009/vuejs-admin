import { RoleEnum } from '../users'

export interface BranchModel {
  id: number
  name: string
  code: string
}

export interface UserInfoModel {
  message: string
  user: UserInfoDataModel
}
export interface UserInfoDataModel {
  id: number
  name: string
  username: string
  phoneNumber: string
  role: RoleEnum
  branch: BranchModel
  firstLogin: boolean
  full_name: string
  avatar: string
  email: string
  created_at: string
  updated_at: string
}

export interface LoginFormModel {
  username: string
  password: string
}
