import { SelectOptionModel } from '@/@types/common'

export enum RoleEnum {
  ADMIN = 'ADMIN',
  MARKER = 'MARKER',
  CHECKER = 'CHECKER'
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  UNACTIVE = 'UNACTIVE',
  BLOCK = 'BLOCK'
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

export interface UpdateUserRequestModel extends AddUserRequestModel {
  block: boolean
}

/**********************/
export const roleSelectOptions: SelectOptionModel[] = [
  {
    label: 'Admin',
    value: 'ADMIN',
    description: 'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker'
  },
  {
    label: 'Checker',
    value: 'CHECKER',
    description: 'Xác nhận và phê duyệt Bộ chứng từ'
  },
  {
    label: 'Marker',
    value: 'MARKER',
    description: 'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công'
  },
  {
    label: 'Viewer',
    value: 'VIEWER',
    description: 'Chỉ có quyền xem'
  }
]

export const userListColumnConfigs = [
  {
    field: 'stt',
    label: 'Stt'
  },
  {
    field: 'name',
    label: 'Name'
  },
  {
    field: 'role',
    label: 'Role'
  },
  {
    field: 'sql',
    label: 'Sql'
  },
  {
    field: 'status',
    label: 'Status'
  },
  {
    field: 'actions',
    label: 'Actions'
  }
]
