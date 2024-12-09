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
    value: RoleEnum.ADMIN,
    description: 'Quyền hạn cao nhất và cũng có thể thực hiện các chức năng tương tự như Checker'
  },
  {
    label: 'Checker',
    value: RoleEnum.CHECKER,
    description: 'Xác nhận và phê duyệt Bộ chứng từ'
  },
  {
    label: 'Maker',
    value: RoleEnum.MAKER,
    description: 'Upload chứng từ, kiểm tra Bộ chứng từ sau khi hệ thống xử lý thành công'
  },
  {
    label: 'Viewer',
    value: RoleEnum.VIEWER,
    description: 'Chỉ có quyền xem'
  }
]

export const userListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'Stt',
    width: 80
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
    value: RoleEnum.ADMIN
  },
  {
    label: 'Checker',
    value: RoleEnum.CHECKER
  },
  {
    label: 'Maker',
    value: RoleEnum.MAKER
  },
  {
    label: 'Viewer',
    value: RoleEnum.VIEWER
  }
]

export const statusTypeOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Active',
    value: UserStatusEnum.ACTIVE
  },
  {
    label: 'Inactive',
    value: UserStatusEnum.INACTIVE
  }
]

export const configRoleUserTableData = [
  {
    name: 'Tổng quan',
    title: 1
  },
  {
    name: 'Quản lý chứng từ',
    title: 1
  },
  {
    name: 'Xem thông tin các bộ chứng từ',
    title: 2
  },
  {
    name: 'Thêm bộ chứng từ',
    title: 2
  },
  {
    name: 'Cập nhật thông tin bộ chứng từ',
    title: 2
  },
  {
    name: 'Xóa bộ chứng từ',
    title: 2
  },
  {
    name: 'Trích xuất thông tin',
    title: 1
  },
  {
    name: 'Xem kết quả sau khi OCR hoàn tất',
    title: 2
  },
  {
    name: 'Chỉnh sửa thông tin sau khi OCR hoàn tất',
    title: 2
  },
  {
    name: 'Phê duyệt kết quả sau khi kiểm tra',
    title: 2
  },
  {
    name: 'Xem lịch sử chỉnh sửa thông tin',
    title: 2
  }
]
