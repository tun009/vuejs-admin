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
    label: 'STT',
    width: 80
  },
  {
    field: 'name',
    label: 'Họ tên'
  },
  {
    field: 'role',
    label: 'Vai trò'
  },
  {
    field: 'branch',
    label: 'SOL'
  },
  {
    field: 'status',
    label: 'Trạng thái'
  },
  {
    field: 'actions',
    label: 'Hành động'
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
    name: 'Xem danh sách các bộ chứng từ',
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
    name: 'Xem chi tiết bộ chứng từ',
    title: 2
  },
  {
    name: 'Trình phê duyệt bộ chứng từ',
    title: 2
  },
  {
    name: 'Trích xuất thông tin',
    title: 1
  },
  {
    name: 'Chỉnh sửa thông tin trích xuất',
    title: 2
  },
  {
    name: 'Thay thế chứng từ',
    title: 2
  },
  {
    name: 'Chỉnh sửa phân loại chứng từ',
    title: 2
  },
  {
    name: 'Xem lịch sử chỉnh sửa thông tin',
    title: 2
  },
  {
    name: 'Ghi chú thông tin',
    title: 2
  },
  {
    name: 'Đối sánh thông tin',
    title: 1
  },
  {
    name: 'Đối sánh bộ chứng từ',
    title: 2
  },
  {
    name: 'Chỉnh sửa kết quả đối sánh thông tin',
    title: 2
  },
  {
    name: 'Xem lịch sử chỉnh sửa kết quả',
    title: 2
  },
  {
    name: 'Xác nhận kết quả kiểm tra bộ chứng từ',
    title: 2
  },
  {
    name: 'Phê duyệt kết quả kiểm tra bộ chứng từ',
    title: 2
  },
  {
    name: 'Tải kết quả kiểm tra bộ chứng từ',
    title: 2
  },
  {
    name: 'Báo cáo',
    title: 1
  },
  {
    name: 'Xem báo cáo, thống kê dữ liệu',
    title: 2
  },
  {
    name: 'Xem chi tiết thống kê dữ liệu',
    title: 2
  },
  {
    name: 'Cài đặt',
    title: 1
  },
  {
    name: 'Cài đặt tên trường trích xuất',
    title: 2
  },
  {
    name: 'Cài đặt màu sắc theo độ tin cậy',
    title: 2
  },
  {
    name: 'Cài đặt luồng kiểm tra',
    title: 2
  },
  {
    name: 'Quản lý người dùng',
    title: 1
  },
  {
    name: 'Danh sách người dùng',
    title: 2
  },
  {
    name: 'Thêm người dùng',
    title: 2
  },
  {
    name: 'Cập nhật thông tin người dùng',
    title: 2
  },
  {
    name: 'Khóa tài khoản người dùng',
    title: 2
  },
  {
    name: 'Xóa người dùng',
    title: 2
  },
  {
    name: 'Quản lý rule chứng từ',
    title: 1
  },
  {
    name: 'Xem danh sách luật UCP/ISBP',
    title: 2
  },
  {
    name: 'Chỉnh sửa nội dung luật UCP/ISBP',
    title: 2
  },
  {
    name: 'Quản lý danh mục các bất hợp lệ',
    title: 1
  },
  {
    name: 'Xem danh sách danh mục các bất hợp lệ',
    title: 2
  },
  {
    name: 'Chỉnh sửa nội dung các bất hợp lệ trên từng loại chứng từ',
    title: 2
  }
]

export enum LonginTypeEnum {
  PASSWORD = 'password',
  AUTH_CODE = 'authorization_code'
}
