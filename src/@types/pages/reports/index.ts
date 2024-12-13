import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import { STATUS_COLORS } from '@/constants/color'
import { DocumentResultEnum } from '../docs/documents'

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

export enum ProcessingStepEnum {
  NEW = 'NEW',
  OCR = 'OCR',
  CHECK = 'CHECK',
  VALIDATE = 'VALIDATE'
}

export enum DossierDocStatusEnum {
  NEW = 'NEW',
  OCRING = 'OCRING',
  OCRED = 'OCRED'
}

export enum FileStatusEnum {
  NEW = 'NEW',
  CLASSIFYING = 'CLASSIFYING',
  CLASSIFIED = 'CLASSIFIED',
  DELETED = 'DELETED'
}

export enum OcrSourceEnum {
  OCR = 'OCR',
  NLP = 'NLP'
}

export interface CompareRejectFormModel {
  reason: string
}

export interface CompareContentFormModel {
  field: number
}

export interface UpdateLCFormModel {
  amount: number
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
    width: 200
  },
  {
    field: 'comparisonTimes',
    label: 'Tổng lần đối sánh',
    width: 200
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

export interface DocumentFileModel {
  id: number | string
  fileName: string
  status: string
  createdAt: string
  createdBy: string
}

export interface DocumentResultModel {
  id: string | number
  fileName: string
  testResults: DocumentResultEnum
  numberSatisfiesRequirement: string
}

export interface ApproveProcessDocumentModel {
  id: string | number
  name: string
  username: string
}

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
    label: 'Đã đối sánh',
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

export const processingStepOptions: SelectOptionModel[] = [
  {
    label: 'Tạo mới yêu cầu',
    value: ProcessingStepEnum.NEW
  },
  {
    label: 'Đang xử lý',
    value: ProcessingStepEnum.OCR
  },
  {
    label: 'Kiểm tra',
    value: ProcessingStepEnum.CHECK
  },
  {
    label: 'Phê duyệt',
    value: ProcessingStepEnum.VALIDATE
  }
]

export const documentResultOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Hợp lệ',
    value: DocumentResultEnum.COMPLY
  },
  {
    label: 'Bất hợp lệ',
    value: DocumentResultEnum.DISCREPANCY
  }
]

export const documentResultValidOptions: SelectOptionModel[] = [
  {
    label: 'Hợp lệ',
    value: 'valid'
  },
  {
    label: 'Bất hợp lệ',
    value: 'invalid'
  },
  {
    label: 'N/A',
    value: 'na'
  }
]

export const documentResultRuleOptions: SelectOptionModel[] = [
  {
    label: 'Ref: UCP 600, Art.14i, : A document may ',
    value: 0
  },
  {
    label: 'Ref: UCP 600, Art.14i, : A document may Meo',
    value: 1
  }
]

export const fileListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.stt',
    width: 80
  },
  {
    field: 'fileName',
    label: 'docs.document.fileName',
    minWidth: 200
  },
  {
    field: 'status',
    label: 'docs.document.status',
    minWidth: 150
  },
  {
    field: 'createdAt',
    label: 'docs.document.createdAt',
    width: 150
  },
  {
    field: 'createdBy',
    label: 'docs.document.createdBy',
    minWidth: 150
  },
  {
    field: 'actions',
    label: 'docs.document.actions',
    width: 150
  }
]

export const documentResultListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.#',
    minWidth: 80
  },
  {
    field: 'fileName',
    label: 'docs.document.documentName_1',
    minWidth: 200
  },
  {
    field: 'testResults',
    label: 'docs.document.testResults',
    minWidth: 150
  },
  {
    field: 'numberSatisfiesRequirement',
    label: 'docs.document.numberSatisfiesRequirement',
    minWidth: 250
  },
  {
    field: 'actions',
    label: 'docs.document.actions',
    minWidth: 150
  }
]

export const approveProcessDocumentColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.stt',
    width: 80
  },
  {
    field: 'select',
    label: 'docs.document.select',
    width: 80
  },
  {
    field: 'checker',
    label: 'docs.document.checkerName',
    minWidth: 200
  }
]

export const documentTypeOptions: SelectOptionModel[] = [
  {
    label: 'Invoice',
    value: 0
  },
  {
    label: 'Bill of lading',
    value: 1
  },
  {
    label: 'Drafts',
    value: 2
  },
  {
    label: 'Giấy Xuất trình chứng từ',
    value: 3
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
