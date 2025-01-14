import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import { STATUS_COLORS } from '@/constants/color'

export interface ReportModel {
  batchId: number
  stt: number
  name: string
  type: string
  status: string
  result: string
  sol: string
  totalTime: string
  system: string
  maker: string
  checker: string
}

export interface ReportDetailModel {
  batchId: number
  name: string
  lcNo: string
  bizType: string
  branch: {
    id: number
    name: string
    code: string
  }
  customerName: string
  status: string
  result: string
  maker: {
    id: number
    name: string
    username: string
    phoneNumber: string
    role: string
    branch: {
      id: number
      name: string
      code: string
    }
    status: string
  }
  checker: {
    id: number
    name: string
    username: string
    phoneNumber: string
    role: string
    branch: {
      id: number
      name: string
      code: string
    }
    status: string
  }
  totalOcr: number
  totalTimeProcessHandle: number
  timeSystemHandle: number
  timeMakerHandle: number
  timeCheckerHandle: number
  statDossier: [
    {
      docType: string
      totalFieldEdit: number
      totalFieldOcr: number
      totalRequestOcrEdit: number
      totalRequestOcr: number
    }
  ]
}

export interface FilterReportModel {
  name: string
  status: DocumentStatusEnum[]
  result: number
  bizType: number
  branchId: number
  beginDate: string
  endDate: string
  sortItemList: {
    isAsc: boolean
    column: string
  }[]
}

// document enum
export enum BusinessTypeEnum {
  NA = 'NA',
  LC_IN = 'LC_IN',
  LC_OUT = 'LC_OUT'
}

export const docListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'STT',
    width: 80
  },
  {
    field: 'name',
    label: 'Tên bộ chứng từ',
    width: 250
  },
  {
    field: 'lcNo',
    label: 'Mã LC',
    width: 200
  },
  {
    field: 'bizType',
    label: 'Loại nghiệp vụ',
    width: 200
  },
  {
    field: 'status',
    label: 'Trạng thái',
    width: 200
  },
  {
    field: 'result',
    label: 'Kết quả xử lý',
    width: 150
  },
  {
    field: 'comparisonTimes',
    label: 'Tổng lần đối sánh',
    width: 150
  },
  {
    field: 'branch',
    label: 'SOL',
    width: 200
  },
  {
    field: 'totalTimeProcessHandle',
    label: 'Tổng thời gian xử lý',
    width: 200
  },
  {
    field: 'timeSystemHandle',
    label: 'Hệ thống xử lý',
    width: 200
  },
  {
    field: 'timeMakerHandle',
    label: 'Maker xử lý',
    width: 200
  },
  {
    field: 'timeCheckerHandle',
    label: 'Checker xử lý',
    width: 200
  }
]

export const reportStatusOptions: SelectOptionModel[] = [
  {
    label: 'Mới',
    value: DocumentStatusEnum.NEW,
    color: STATUS_COLORS.NEW
  },
  {
    label: 'Đang phân loại',
    value: DocumentStatusEnum.CLASSIFYING,
    color: STATUS_COLORS.CLASSIFYING
  },
  {
    label: 'Đã phân loại',
    value: DocumentStatusEnum.CLASSIFIED,
    color: STATUS_COLORS.OCRED
  },
  {
    label: 'Đang xử lý OCR',
    value: DocumentStatusEnum.OCRING,
    color: STATUS_COLORS.CLASSIFYING
  },
  {
    label: 'Đã trích xuất',
    value: DocumentStatusEnum.OCRED,
    color: STATUS_COLORS.OCRED
  },
  {
    label: 'Chờ kiểm tra',
    value: DocumentStatusEnum.WAIT_CHECK,
    color: STATUS_COLORS.WAIT_CHECK
  },
  {
    label: 'Đang kiểm tra',
    value: DocumentStatusEnum.CHECKING,
    color: STATUS_COLORS.CLASSIFYING
  },
  {
    label: 'Đã kiểm tra',
    value: DocumentStatusEnum.CHECKED,
    color: STATUS_COLORS.CHECKED
  },
  {
    label: 'Chờ phê duyệt',
    value: DocumentStatusEnum.WAIT_VALIDATE,
    color: STATUS_COLORS.WAIT_CHECK
  },
  {
    label: 'Đang phê duyệt',
    value: DocumentStatusEnum.VALIDATING,
    color: STATUS_COLORS.WAIT_CHECK
  },
  {
    label: 'YC điều chỉnh',
    value: DocumentStatusEnum.ADJUST_REQUESTED,
    color: STATUS_COLORS.WAIT_CHECK
  },
  {
    label: 'Đã phê duyệt',
    value: DocumentStatusEnum.VALIDATED,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Từ chối',
    value: DocumentStatusEnum.DENIED,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Lỗi',
    value: DocumentStatusEnum.ERROR,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Đã xóa',
    value: DocumentStatusEnum.DELETED,
    color: STATUS_COLORS.ERROR
  }
]

export const businessTypeOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'LC Xuất',
    value: BusinessTypeEnum.LC_OUT
  },
  {
    label: 'LC Nhập',
    value: BusinessTypeEnum.LC_IN
  }
]

export interface FilterDocumentModel {
  name: string
  status: DocumentStatusEnum[]
  result: number
  bizType: number
  branchId: number
  beginDate: string
  endDate: string
  sortItemList: {
    isAsc: boolean
    column: string
  }[]
}

export enum FilterTypeEnum {
  BCT = 'BCT',
  LC = 'LC'
}

export const filterTypeSelectOptions = [
  {
    label: 'Tên BCT',
    value: FilterTypeEnum.BCT
  },
  {
    label: 'Mã LC',
    value: FilterTypeEnum.LC
  }
]
