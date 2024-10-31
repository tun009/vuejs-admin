import { ColumnConfigModel, SelectOptionModel } from '@/@types/common'
import { BranchModel } from '../login'
import { AddUserRequestModel } from './services/UserRequest'

export enum RoleEnum {
  ADMIN = 'ADMIN',
  MAKER = 'MAKER',
  CHECKER = 'CHECKER',
  VIEWER = 'VIEWER'
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  UNACTIVE = 'UNACTIVE',
  BLOCK = 'BLOCK'
}

export interface UserModel {
  id: number
  name: string
  username: string
  role: RoleEnum
  phoneNumber: string
  branch: BranchModel
}

export interface UpdateUserRequestModel extends AddUserRequestModel {
  block: boolean
}

/**********************/
export const roleSelectOptions: SelectOptionModel[] = [
  {
    label: 'Admin',
    value: 'admin',
    description: 'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker'
  },
  {
    label: 'Checker',
    value: 'checker',
    description: 'Xác nhận và phê duyệt Bộ chứng từ'
  },
  {
    label: 'Maker',
    value: 'maker',
    description: 'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công'
  },
  {
    label: 'Viewer',
    value: 'viewer',
    description: 'Chỉ có quyền xem'
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

export interface FilterUserModel {
  searchCount: boolean
  sortItemList: {
    isAsc: boolean
    column: string
  }[]
  name: string
  branchId: number
  role: string | number
  status?: number
}
