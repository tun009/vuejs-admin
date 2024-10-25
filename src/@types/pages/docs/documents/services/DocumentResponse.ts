import { BranchModel } from '@/@types/pages/login'
import {
  ApproveProcessDocumentModel,
  BusinessTypeEnum,
  DocumentFileModel,
  DocumentModel,
  DocumentResultModel,
  ProcessingStepEnum
} from '..'

import { BaseListResponseModel, DocumentStatusEnum } from '@/@types/common'

export type GetDocumentResponseModel = BaseListResponseModel<DocumentModel>

export type GetDocumentDetailResponseModel = ApiResponseData<DocumentModel>

export type GetDocumentFileResponseModel = ApiResponseData<DocumentFileModel[]>

export type GetDocumentResultsResponseModel = BaseListResponseModel<DocumentResultModel>

export type GetCheckersResponseModel = BaseListResponseModel<ApproveProcessDocumentModel>

export interface BatchDetailModel {
  id: number
  dossierName: string
  bizType: BusinessTypeEnum
  status: DocumentStatusEnum
  handleBy: string
  step: ProcessingStepEnum
  branch: BranchModel
  cif: string
  customerName: string
  createdAt: string

  docCreditNo: string
  dateIssue: string
  expiryDate: string
  expiryPlace: string
  tolerancePercent: string
  partialShipments: string
  periodPresentation: string
  datePresentation: string
}

export type GetBatchDetailResponseModel = ApiResponseData<BatchDetailModel>
