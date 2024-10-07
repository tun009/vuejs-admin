import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import { RoleEnum } from '../../users'

export enum BusinessTypeEnum {
  EXPORT_LC,
  IMPORT_LC
}

export enum DocumentResultEnum {
  VALID,
  INVALID
}

export enum ProcessingStepEnum {
  CREATE_NEW_REQUEST,
  PROCESSING,
  CHECK,
  APPROVE
}

export interface DocumentModel {
  id: number
  stt: number
  documentName: string
  businessType: BusinessTypeEnum
  status: DocumentStatusEnum
  processingStep: ProcessingStepEnum
  sol: string
  cif: string
  customerName: string
  amount: string
  createdAt: string
  createdBy: string
  result: DocumentResultEnum
  completioDate: string
}

export const docListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'Stt'
  },
  {
    field: 'documentName',
    label: 'Document name',
    minWidth: 200
  },
  {
    field: 'businessType',
    label: 'Type of business',
    minWidth: 150
  },
  {
    field: 'status',
    label: 'Status',
    minWidth: 150
  },
  {
    field: 'handler',
    label: 'Handler',
    minWidth: 100
  },
  {
    field: 'processingStep',
    label: 'Processing step',
    minWidth: 150
  },
  {
    field: 'sol',
    label: 'SOL',
    minWidth: 100
  },
  {
    field: 'cif',
    label: 'CIF'
  },
  {
    field: 'customerName',
    label: 'Customer name',
    minWidth: 150
  },
  {
    field: 'amount',
    label: 'Amount',
    minWidth: 120
  },
  {
    field: 'createdAt',
    label: 'Uploaded at',
    minWidth: 120
  },
  {
    field: 'createdBy',
    label: 'Uploaded by',
    minWidth: 120
  },
  {
    field: 'result',
    label: 'Result',
    minWidth: 150
  },
  {
    field: 'completioDate',
    label: 'Completion date',
    minWidth: 120
  },
  {
    field: 'actions',
    label: 'Action'
  }
]

// mock data
export const HANDLER_LIST = [RoleEnum.MARKER, RoleEnum.CHECKER]
export const DOCUMENT_STATUS_LIST = [
  DocumentStatusEnum.NEW,
  DocumentStatusEnum.CLASSIFYING,
  DocumentStatusEnum.CLASSIFIED,
  DocumentStatusEnum.OCRING,
  DocumentStatusEnum.MATCHED,
  DocumentStatusEnum.WAIT_FOR_CHECK,
  DocumentStatusEnum.CHECKED,
  DocumentStatusEnum.WAIT_FOR_APPROVAL,
  DocumentStatusEnum.NEED_ADJUSTMENT,
  DocumentStatusEnum.APPROVED,
  DocumentStatusEnum.REJECTED,
  DocumentStatusEnum.CLASSIFITION_ERROR,
  DocumentStatusEnum.IDENTIFICATION_ERROR,
  DocumentStatusEnum.MATCHING_ERROR
]

export const BUSINESS_TYPE_LIST = [BusinessTypeEnum.EXPORT_LC, BusinessTypeEnum.IMPORT_LC]
export const DOCUMENT_RESULT_LIST = [DocumentResultEnum.VALID, DocumentResultEnum.INVALID]
export const PROCESSING_STEP_LIST = [
  ProcessingStepEnum.CREATE_NEW_REQUEST,
  ProcessingStepEnum.PROCESSING,
  ProcessingStepEnum.CHECK,
  ProcessingStepEnum.APPROVE
]

export const DOCUMENT_STATUS_NAME_LIST = [
  'Mới',
  'Đang phân loại',
  'Đã phân loại',
  'Đang xử lý OCR',
  'Đã đối sánh',
  'Chờ kiểm tra',
  'Đã kiểm tra',
  'Chờ phê duyệt',
  'Cần điều chỉnh',
  'Đã phê duyệt',
  'Từ chối',
  'Lỗi phân loại',
  'Lỗi nhận dạng',
  'Lỗi đối sánh'
]
export const BUSINESS_TYPE_NAME_LIST = ['LC Xuất', 'LC Nhập']
export const PROCESSING_STEP_NAME_LIST = ['Tạo mới yêu cầu', 'Đang xử lý', 'Kiểm tra', 'Phê duyệt']
export const DOCUMENT_RESULT_NAME_LIST = ['Hợp lệ', 'Bất hợp lệ']

export const documentStatusOptions: SelectOptionModel[] = [
  {
    label: 'Mới',
    value: 0
  },
  {
    label: 'Đang phân loại',
    value: 1
  },
  {
    label: 'Đã phân loại',
    value: 2
  },
  {
    label: 'Đang xử lý OCR',
    value: 3
  },
  {
    label: 'Đã đối sánh',
    value: 4
  },
  {
    label: 'Chờ kiểm tra',
    value: 5
  },
  {
    label: 'Đã kiểm tra',
    value: 6
  },
  {
    label: 'Chờ phê duyệt',
    value: 7
  },
  {
    label: 'Cần điều chỉnh',
    value: 8
  },
  {
    label: 'Đã phê duyệt',
    value: 9
  },
  {
    label: 'Từ chối',
    value: 10
  },
  {
    label: 'Lỗi phân loại',
    value: 11
  },
  {
    label: 'Lỗi nhận dạng',
    value: 12
  },
  {
    label: 'Lỗi đối sánh',
    value: 13
  }
]

export const businessTypeOptions: SelectOptionModel[] = [
  {
    label: 'LC Xuất',
    value: 0
  },
  {
    label: 'LC Nhập',
    value: 1
  }
]

export const processingStepOptions: SelectOptionModel[] = [
  {
    label: 'Tạo mới yêu cầu',
    value: 0
  },
  {
    label: 'Đang xử lý',
    value: 1
  },
  {
    label: 'Kiểm tra',
    value: 2
  },
  {
    label: 'Phê duyệt',
    value: 3
  }
]

export const documentResultOptions: SelectOptionModel[] = [
  {
    label: 'Hợp lệ',
    value: 0
  },
  {
    label: 'Bất hợp lệ',
    value: 1
  }
]
