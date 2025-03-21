import { DocumentStatusEnum, PaginationModel } from '@/@types/common'
import {
  BusinessTypeEnum,
  DocumentResultEnum,
  FilterDocumentModel,
  PatchDocumentCompareUndefinedModel,
  UpdateLCAmountFormModel
} from '..'
import { RuleTypeEnum } from '@/@types/pages/rules'

export type GetDocumentRequestModel = PaginationModel & Partial<FilterDocumentModel>

export interface UpdateDictionaryRequestModel {
  en: string
  vi: string
  type: RuleTypeEnum
}

export type PatchDocumentCompareUndefinedRequestModel = PatchDocumentCompareUndefinedModel[]

export interface DocumentComparisonResultReasonModel {
  comparisonResultReasonId: number | null
  reasons: {
    code: string
    en: string
    vi: string
  }[]
  laws: {
    code: string
    en: string
  }[]
}

export interface UpdateDocumentCompareResultRequestModel {
  comparisonResultId: number
  status: DocumentResultEnum
  comparisonResultReasons: DocumentComparisonResultReasonModel[]
}

export interface UpdateDocumentCompareResultTableRequestModel {
  comparisonId: number
  status: DocumentResultEnum
  reasons: DocumentComparisonResultReasonModel[]
}

export interface UpdateDocumentStatusModel {
  approveDossier: DocumentStatusEnum
  message?: string
  isOCR?: boolean
}

export interface AddDocumentRequestModel {
  bizType?: BusinessTypeEnum
  name: string
  branchId?: number
  customerName: string
  cif?: string
}

export interface UpdateDocumentRequestModel {
  id?: number
  name: string
  branchId?: number
  cif?: string
  customerName?: string
}

export interface UpdateBatchAmountRequestModel {
  batchId: number
  amountClaimed: number
}

export interface UpdateLCAmountRequestModel extends UpdateLCAmountFormModel {
  batchId: number
}
export interface UpdateDosssierReplaceRequestModel {
  dossierDocId?: number
  docType?: string
  fileId: number
}
