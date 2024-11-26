import { DocumentStatusEnum, PaginationModel } from '@/@types/common'
import { BusinessTypeEnum, FilterDocumentModel, UpdateLCAmountFormModel } from '..'
import { RuleTypeEnum } from '@/@types/pages/rules'

export type GetDocumentRequestModel = PaginationModel & Partial<FilterDocumentModel>

export interface UpdateDictionaryRequestModel {
  en: string
  vi: string
  type: RuleTypeEnum
}

export interface UpdateDocumentStatusModel {
  approveDossier: DocumentStatusEnum
  message?: string
}

export interface AddDocumentRequestModel {
  bizType?: BusinessTypeEnum
  name: string
  branchId?: number
  customerName: string
  cif?: string
  // amountClaimed: number
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
