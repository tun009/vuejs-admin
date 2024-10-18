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
  completionDate: string
}

export const docListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.stt'
  },
  {
    field: 'documentName',
    label: 'docs.document.documentName',
    minWidth: 200
  },
  {
    field: 'businessType',
    label: 'docs.document.businessType',
    minWidth: 150
  },
  {
    field: 'status',
    label: 'docs.document.status',
    minWidth: 150
  },
  {
    field: 'handler',
    label: 'docs.document.handler',
    minWidth: 150
  },
  {
    field: 'processingStep',
    label: 'docs.document.processingStep',
    minWidth: 150
  },
  {
    field: 'sol',
    label: 'docs.document.sol',
    minWidth: 100
  },
  {
    field: 'cif',
    label: 'docs.document.cif'
  },
  {
    field: 'customerName',
    label: 'docs.document.customerName',
    minWidth: 150
  },
  {
    field: 'amount',
    label: 'docs.document.amount',
    minWidth: 120
  },
  {
    field: 'createdAt',
    label: 'docs.document.createdAt',
    minWidth: 120
  },
  {
    field: 'createdBy',
    label: 'docs.document.createdBy',
    minWidth: 120
  },
  {
    field: 'result',
    label: 'docs.document.result',
    minWidth: 150
  },
  {
    field: 'completionDate',
    label: 'docs.document.completionDate',
    minWidth: 150
  },
  {
    field: 'actions',
    label: 'docs.document.actions',
    minWidth: 120
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

export interface DocumentFileModel {
  id: number | string
  stt: number
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

export interface DocumentResultDataModel {
  status: 'valid' | 'invalid' | 'na'
  reasonEn?: string
  reasonVi?: string
  rule?: string
}

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
    label: 'docs.document.stt'
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
    minWidth: 150
  },
  {
    field: 'createdBy',
    label: 'docs.document.createdBy',
    minWidth: 150
  },
  {
    field: 'actions',
    label: 'docs.document.actions',
    minWidth: 150
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
