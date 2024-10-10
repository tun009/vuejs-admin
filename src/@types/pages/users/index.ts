import { ColumnConfigModel, SelectOptionModel } from '@/@types/common'

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
  sol: string
  solId: number
  status: UserStatusEnum
}

export interface AddUserRequestModel {
  name: string
  username: string
  sol: string
  role: RoleEnum
}

export interface UpdateUserRequestModel extends AddUserRequestModel {
  block: boolean
}

/**********************/
export const roleSelectOptions: SelectOptionModel[] = [
  {
    description: 'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker',
    label: 'Admin',
    value: 'ADMIN'
  },
  {
    description: 'Xác nhận và phê duyệt Bộ chứng từ',
    label: 'Checker',
    value: 'CHECKER'
  },
  {
    description: 'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công',
    label: 'Marker',
    value: 'MARKER'
  },
  {
    description: 'Chỉ có quyền xem',
    label: 'Viewer',
    value: 'VIEWER'
  }
]

export const userListColumnConfigs: ColumnConfigModel[] = [
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
    field: 'sol',
    label: 'SOL'
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
