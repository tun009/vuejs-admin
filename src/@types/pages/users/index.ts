import { ColumnConfigModel, SelectOptionModel } from '@/@types/common'
import { BranchModel } from '../login'

export enum RoleEnum {
  ADMIN = 'ADMIN',
  MAKER = 'MAKER',
  CHECKER = 'CHECKER',
  VIEWER = 'VIEWER'
}

export interface UserModel {
  id: number
  name: string
  username: string
  role: RoleEnum
  phoneNumber: string
  branch: BranchModel
  status: any
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
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
    field: 'branch',
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
  status: string | number
}

export const roleTypeOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Admin',
    value: 'ADMIN'
  },
  {
    label: 'Checker',
    value: 'CHECKER'
  },
  {
    label: 'Maker',
    value: 'MAKER'
  },
  {
    label: 'Viewer',
    value: 'VIEWER'
  }
]

export const statusTypeOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Active',
    value: 'ACTIVE'
  },
  {
    label: 'Inactive',
    value: 'INACTIVE'
  }
]
