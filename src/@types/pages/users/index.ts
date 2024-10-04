export enum RoleEnum {
  ADMIN = 'ADMIN',
  MARKER = 'MARKER',
  CHECKER = 'CHECKER'
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  UNACTIVE = 'UNACTIVE',
  BLOCk = 'BLOCk'
}

export interface UserModel {
  id: number
  stt: number
  name: string
  username: string
  role: RoleEnum
  isMe?: boolean
  sql: string
  sqlId: number
  status: UserStatusEnum
}

export interface AddUserRequestModel {
  name: string
  username: string
  sql: string
  role: RoleEnum
}
