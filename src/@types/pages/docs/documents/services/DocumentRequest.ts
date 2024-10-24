import { PaginationModel } from '@/@types/common'
import { BusinessTypeEnum, FilterDocumentModel } from '..'

export interface GetDocumentRequestModel extends PaginationModel, Partial<FilterDocumentModel> {}

export interface AddDocumentRequestData {
  businessType?: BusinessTypeEnum
  documentName: string
  sol?: string
  customerName: string
  cif?: string
}

export interface UpdateDocumentRequestModel {
  documentName: string
  sol?: string
  cif?: string
  customerName?: string
}
