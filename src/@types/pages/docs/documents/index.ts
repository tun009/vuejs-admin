/* eslint-disable prettier/prettier */
import { ColumnConfigModel, DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import { RoleEnum } from '@/@types/pages/users'
import { STATUS_COLORS } from '@/constants/color'
import { BranchModel } from '../../login'
import { RuleModel, RuleTypeEnum } from '../../rules'
import { UserModel } from './services/DocumentResponse'
import { DocumentTypeModel } from '../../extract'

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
  VALIDATE = 'VALIDATE',
  COMPARISON = 'COMPARISON',
  CLASSIFY = 'CLASSIFY'
}

export enum DocumentKeyEnum {
  INVOICE = 'Invoice',
  BOL = 'Bill of lading',
  DRAFT = 'Draft',
  PRESENT_DOC = 'Present Document'
}

export enum DocumentSelectTypeKeyEnum {
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  INVOICE = 'INVOICE',
  BILL_OF_LADING = 'BILL_OF_LADING',
  DRAFT = 'DRAFT',
  EXPORT_DOC_PRESENT = 'EXPORT_DOC_PRESENT'
}

export enum DocumentExportFileEnum {
  DOCX = 'docx',
  PDF = 'pdf',
  EXCEL = 'excel'
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
  handleBy?: UserModel
  approveBy?: UserModel
  censorBy?: UserModel
  createdBy?: UserModel
  result: DocumentResultEnum
  doneAt: string
}

export interface CompareRejectFormModel {
  reason: string
}

export type CompareReturnFormModel = CompareRejectFormModel

export interface CompareContentFormModel {
  id?: number
  requirement: string
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
    field: 'lcNo',
    label: 'docs.document.lcCode',
    minWidth: 200
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
    minWidth: 200
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
    field: 'actions',
    label: 'docs.document.actions',
    minWidth: 120
  }
]

export interface DocumentFileModel {
  id: number | string
  fileName: string
  status: DocumentStatusEnum
  createdAt: string
  createdBy: string
}

export interface DocumentSumaryModel {
  key: DocumentKeyEnum
  status: DocumentResultEnum
  totalRequest: number
  totalSatisfiedRequest: number
}

export interface ApproveProcessDocumentModel {
  id: string | number
  name: string
  username: string
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
    label: 'Đang đối sánh',
    value: DocumentStatusEnum.COMPARING,
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
    label: 'Lỗi phân loại',
    value: DocumentStatusEnum.CLASSIFY_ERROR,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Lỗi nhận dạng',
    value: DocumentStatusEnum.OCR_ERROR,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Lỗi phân loại',
    value: DocumentStatusEnum.CLASSIFICATION_ERROR,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Lỗi nhận dạng',
    value: DocumentStatusEnum.EXTRACTION_ERROR,
    color: STATUS_COLORS.ERROR
  },
  {
    label: 'Lỗi đối sánh',
    value: DocumentStatusEnum.COMPARISON_ERROR,
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
    label: 'Tạo mới',
    value: ProcessingStepEnum.NEW
  },
  {
    label: 'Trích xuất',
    value: ProcessingStepEnum.OCR
  },
  {
    label: 'Kiểm tra',
    value: ProcessingStepEnum.CHECK
  },
  {
    label: 'Phê duyệt',
    value: ProcessingStepEnum.VALIDATE
  },
  {
    label: 'Đối sánh',
    value: ProcessingStepEnum.COMPARISON
  },
  {
    label: 'Phân loại',
    value: ProcessingStepEnum.CLASSIFY
  }
]

export const documentResultOptions: SelectOptionModel[] = [
  {
    label: 'Tất cả',
    value: -1
  },
  {
    label: 'Hợp lệ',
    value: DocumentResultEnum.COMPLY,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Bất hợp lệ',
    value: DocumentResultEnum.DISCREPANCY,
    color: STATUS_COLORS.WAIT_CHECK
  }
]

export const documentResultValidOptions: SelectOptionModel[] = [
  {
    label: 'Hợp lệ',
    value: DocumentResultEnum.COMPLY
  },
  {
    label: 'Bất hợp lệ',
    value: DocumentResultEnum.DISCREPANCY
  },
  {
    label: 'N/A',
    value: DocumentResultEnum.NA
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
    value: DocumentKeyEnum.INVOICE
  },
  {
    label: 'Bill of lading',
    value: DocumentKeyEnum.BOL
  },
  {
    label: 'Drafts',
    value: DocumentKeyEnum.DRAFT
  },
  {
    label: 'Giấy Xuất trình chứng từ',
    value: DocumentKeyEnum.PRESENT_DOC
  }
]

export const documentSelectTypeOptions: SelectOptionModel[] = [
  {
    label: 'LC',
    value: DocumentSelectTypeKeyEnum.LETTER_OF_CREDIT
  },
  {
    label: 'Invoice',
    value: DocumentSelectTypeKeyEnum.INVOICE
  },
  {
    label: 'Bill of lading',
    value: DocumentSelectTypeKeyEnum.BILL_OF_LADING
  },
  {
    label: 'Drafts',
    value: DocumentSelectTypeKeyEnum.DRAFT
  },
  {
    label: 'Giấy XTCT',
    value: DocumentSelectTypeKeyEnum.EXPORT_DOC_PRESENT
  }
]

export interface FilterDocumentModel {
  name?: string
  lcNo?: string
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

export enum CompareHistoryTypeEnum {
  EDIT = 'EDIT',
  CHECKED = 'CHECKED',
  VALIDATED = 'VALIDATED',
  DENIED = 'DENIED',
  ADJUST_REQUESTED = 'ADJUST_REQUESTED',
  ADDITIONAL = 'ADDITIONAL',
  LC = 'LC'
}

export type CompareHistoryModel = CompareHistoryItemModel[][]

export interface CompareHistoryItemModel {
  title: string
  type: CompareHistoryTypeEnum
  valueBefore?: string[]
  valueAfter?: string[]
  createdBy: string
  role: RoleEnum
  day: string
  hour: string
}

export interface CompareHistoryActionModel {
  title: string
  valueBefore: string[] | null
  valueAfter: string[] | null
}

export interface CompareHistoryTimeModel {
  hour: string
  createdBy: string
  role: RoleEnum
  type: CompareHistoryTypeEnum
  actions: CompareHistoryActionModel[]
}

export interface CompareHistoryCustomModel {
  day: string
  hours: CompareHistoryTimeModel[]
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
  laws: RuleModel[]
  reasons: RuleModel[]
  lawIds: string[]
  reasonId: string[]
  compareOn: string[]
}

export type CompareReasonOnlyResultModel = Omit<CompareReasonResultModel, 'id' | 'compareOn'>

export interface ComparisonResultModel {
  id: number
  title: string
  status: DocumentResultEnum
  comparisonReasonResults: CompareReasonResultModel[]
  comparisonInputResults: {
    title: string
    comparisonResultInputValues: {
      value:
        | string
        | { [key: string]: string }[]
        | { bboxes: number[][][]; raw_file: string; page_id: number }
        | string[]
      type: string
      key: string
      prefixValue: string
    }[]
  }[]
}

export interface ComparisonCellResultModel {
  doc: string
  value: string | string[]
  comparisonResult: ComparisonResultModel
}

export interface DocumentCompareModel {
  id: number
  sort?: string | number
  title: string
  key: DocumentKeyEnum
  status: DocumentResultEnum
  comparisonResults: {
    [key: string]: ComparisonResultModel
  }
  comparisonRowResults: {
    stt: number
    fieldName: string
    comparisonCellResults: ComparisonCellResultModel[]
  }[]
  undefinedResults: {
    id: number
    inputField: string
    inputValue: string
    requirements: {
      id: number
      requirement: string
      status: DocumentResultEnum
      reason: string
    }[]
  }[]
}

export interface DocumentResultModel {
  status: DocumentResultEnum
  timeOfShipment: DocumentResultEnum
  periodOfPresentation: DocumentResultEnum
  comparisonSummaries: DocumentSumaryModel[]
  lcExpiry: DocumentResultEnum
}

export interface DocumentCompareUndefinedModel {
  pathFile: string
  comparisonUndefinedId: number
  requirements: DocumentCompareUndefinedRequirementModel[]
}

export interface DocumentCompareUndefinedRequirementModel {
  id: number
  requirement: string
  status: DocumentResultEnum
  reason: string
}

export interface UpdateDocumentCompareUndefinedModel {
  id?: number
  reason: string
  status: DocumentResultEnum
}

export interface PatchDocumentCompareUndefinedModel {
  id?: number
  requirement: string
}
export interface DocumentClassifyErrordModel {
  id?: number
  name: string
  dossierFileId: number | string | null
  docType: DocumentTypeModel
  pathFile: string
  pages: string
  pdfEtract?: any
  pageList: number[]
  isLoaded?: boolean
  isReplace?: boolean
  fileId?: number
  countNumReplace?: number
}
export interface ReplaceDocumentClassifyErrordModel {
  fileId: number
  pathFile: string
  docType: string
  dossierFileId: number | string | null
}
export const getAllCategoryRequestModel = { pageNum: 0, pageSize: 9999, type: RuleTypeEnum.CATEGORY, query: '' }
export const getAllRuleRequestModel = { ...getAllCategoryRequestModel, type: RuleTypeEnum.LAW }
export const defaultStatus = documentStatusOptions.slice(0, -5).map((c) => c.value as DocumentStatusEnum)
export interface SocketDataModel {
  id: number
  status: DocumentStatusEnum
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
