import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import { RoleEnum } from '@/@types/pages/users'
import { STATUS_COLORS } from '@/constants/color'
import { BranchModel } from '../../login'

// document enum
export enum BusinessTypeEnum {
  NA = 'NA',
  LC_IN = 'LC_IN',
  LC_OUT = 'LC_OUT'
}

export enum DocumentResultEnum {
  COMPLY = 'COMPLY',
  DISCREPANCY = 'DISCREPANCY',
  NA = 'NA'
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

export enum DocumentKeyModel {
  INVOICE = 'Invoice',
  BOL = 'Bill of lading',
  DRAFT = 'Draft',
  PRESENT_DOC = 'Present Document'
}

export interface DocumentModel {
  id: number
  dossierName: string
  bizType: BusinessTypeEnum
  status: DocumentStatusEnum
  step: ProcessingStepEnum
  branch: BranchModel
  cif: string
  customerName: string
  totalAmount: string
  createdAt: string
  handleBy: string
  approveBy: string
  result: DocumentResultEnum
  doneAt: string
}

export interface CompareRejectFormModel {
  reason: string
}

export interface CompareContentFormModel {
  field: number
}

export const docListColumnConfigs: ColumnConfigModel[] = [
  {
    field: 'stt',
    label: 'docs.document.stt'
  },
  {
    field: 'dossierName',
    label: 'docs.document.documentName',
    minWidth: 200
  },
  {
    field: 'bizType',
    label: 'docs.document.businessType',
    minWidth: 150
  },
  {
    field: 'status',
    label: 'docs.document.status',
    minWidth: 150
  },
  {
    field: 'handleBy',
    label: 'docs.document.handler',
    minWidth: 150
  },
  {
    field: 'step',
    label: 'docs.document.processingStep',
    minWidth: 150
  },
  {
    field: 'branchName',
    label: 'docs.document.sol',
    minWidth: 250
  },
  {
    field: 'cif',
    label: 'docs.document.cif',
    width: 150
  },
  {
    field: 'customerName',
    label: 'docs.document.customerName',
    minWidth: 150
  },
  {
    field: 'totalAmount',
    label: 'docs.document.amount',
    minWidth: 120
  },
  {
    field: 'createdAt',
    label: 'docs.document.createdAt',
    minWidth: 120
  },
  {
    field: 'result',
    label: 'docs.document.result',
    minWidth: 150
  },
  {
    field: 'doneAt',
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
export const HANDLER_LIST = [RoleEnum.MAKER, RoleEnum.CHECKER]
export const DOCUMENT_STATUS_LIST = [
  DocumentStatusEnum.NEW,
  DocumentStatusEnum.CLASSIFYING,
  DocumentStatusEnum.CLASSIFIED,
  DocumentStatusEnum.OCRING,
  DocumentStatusEnum.OCRED,
  DocumentStatusEnum.WAIT_CHECK,
  DocumentStatusEnum.CHECKING,
  DocumentStatusEnum.CHECKED,
  DocumentStatusEnum.WAIT_VALIDATE,
  DocumentStatusEnum.ADJUST_REQUESTED,
  DocumentStatusEnum.VALIDATED,
  DocumentStatusEnum.DENIED,
  DocumentStatusEnum.ERROR
]

export const BUSINESS_TYPE_LIST = [BusinessTypeEnum.NA, BusinessTypeEnum.LC_OUT, BusinessTypeEnum.LC_IN]
export const DOCUMENT_RESULT_LIST = [DocumentResultEnum.COMPLY, DocumentResultEnum.DISCREPANCY]
export const PROCESSING_STEP_LIST = [
  ProcessingStepEnum.NEW,
  ProcessingStepEnum.OCR,
  ProcessingStepEnum.CHECK,
  ProcessingStepEnum.VALIDATE
]

export interface DocumentFileModel {
  id: number | string
  fileName: string
  status: string
  createdAt: string
  createdBy: string
}

export interface DocumentSumaryModel {
  key: DocumentKeyModel
  status: DocumentResultEnum
  totalRequest: number
  totalSatisfiedRequest: number
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
    label: 'Cần điều chỉnh',
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
    field: 'key',
    label: 'docs.document.documentName_1',
    minWidth: 200
  },
  {
    field: 'status',
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
    value: DocumentKeyModel.INVOICE
  },
  {
    label: 'Bill of lading',
    value: DocumentKeyModel.BOL
  },
  {
    label: 'Drafts',
    value: DocumentKeyModel.DRAFT
  },
  {
    label: 'Giấy Xuất trình chứng từ',
    value: DocumentKeyModel.PRESENT_DOC
  }
]

export interface FilterDocumentModel {
  name: string
  status: number[]
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

// compare history mock
export interface CompareHistoryModel {
  date: string
  timeList: CompareHistoryTimeModel[]
}

export interface CompareHistoryTimeModel {
  time: string
  name: string
  role: RoleEnum
  actionList: CompareHistoryActionModel[]
}

export interface CompareHistoryActionModel {
  actionName: string
  beforeUpdate?: CompareHistoryActionUpdateModel
  afterUpdate?: CompareHistoryActionUpdateModel
  isConfirm?: boolean
}

export interface CompareHistoryActionUpdateModel {
  contents?: string[]
  isComplied?: boolean
}

export interface DocumentLCDetailModel {
  batchId: number
  customerName: string
  branchCode: string
  cif: string
  status: DocumentStatusEnum
  checkBy: string
  approveBy: string
  amountClaimed: number
  totalAmount: number
  currency: string
  docCreditNo: string
  dateIssue: string
  expiryDate: string
  expiryPlace: string
  tolerancePercent: string
  partialShipments: string
  periodPresentation: string
  datePresentation: string
}

export interface DocumentLCAmountModel {
  batchId?: number
  totalAmount: number
  amountUsed: number
}

export interface UpdateLCAmountFormModel {
  amountUsed: number
}

export interface DocumentDataLCModel {
  coreKey: string
  extractionValue?: string
  validatedValue?: string
}

export interface CompareReasonResultModel {
  id: number
  compareOn: string[]
  lawIds: string[]
  reasonId: string[]
}

export interface ComparisonResultModel {
  title: string
  status: DocumentResultEnum
  comparisonReasonResults: CompareReasonResultModel[]
  comparisonInputResults: {
    title: string
    comparisonResultInputValues: {
      value: string | { [key: string]: string }[] | { bbox: number[][] }
      type: string
      key: string
      prefixValue: string
    }[]
  }[]
}

export interface DocumentCompareModel {
  id: number
  title: string
  key: DocumentKeyModel
  comparisonResults: {
    [key: string]: ComparisonResultModel
  }
}

export interface DocumentResultModel {
  status: DocumentResultEnum
  timeOfShipment: DocumentResultEnum
  periodOfPresentation: DocumentResultEnum
  comparisonSummaries: DocumentSumaryModel[]
  lcExpiry: DocumentResultEnum
}
