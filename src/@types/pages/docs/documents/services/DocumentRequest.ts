import { PaginationModel } from '@/@types/common'
import { BusinessTypeEnum } from '..'

export interface GetDocumentRequestModel extends PaginationModel {
  searchQuery: string
}

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
