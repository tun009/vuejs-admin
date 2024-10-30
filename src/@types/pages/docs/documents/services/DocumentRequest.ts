import { PaginationModel } from '@/@types/common'
import { BusinessTypeEnum, FilterDocumentModel } from '..'

export interface GetDocumentRequestModel extends PaginationModel, Partial<FilterDocumentModel> {}

export interface AddDocumentRequestData {
  bizType?: BusinessTypeEnum
  name: string
  branchId?: number
  customerName: string
  cif?: string
  amountClaimed: number
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
