import { BranchModel } from '@/@types/pages/login'
import {
  ApproveProcessDocumentModel,
  BusinessTypeEnum,
  CompareHistoryModel,
  DocumentCompareModel,
  DocumentCompareUndefinedModel,
  DocumentDataLCModel,
  DocumentFileModel,
  DocumentLCAmountModel,
  DocumentLCDetailModel,
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

export type GetBranchResponseModel = ApiResponseData<BranchModel[]>

export type GetDocumentLCDetailResponseModel = ApiResponseData<DocumentLCDetailModel>

export type GetDocumentLCAmountResponseModel = ApiResponseData<DocumentLCAmountModel>

export type GetDocumentDataLCResponseModel = ApiResponseData<DocumentDataLCModel[]>

export type PutPresentationCheckerResponseModel = ApiResponseData<number>

export type GetDocumentCompareResponseModel = ApiResponseData<DocumentCompareModel[]>

export type GetDocumentSummaryResponseModel = ApiResponseData<DocumentResultModel>

export type GetDocumentHistoryResponseModel = ApiResponseData<CompareHistoryModel>

export type TranslateEnglishToVietnameseResponseModel = ApiResponseData<string>

export type UpdateDocumentCompareResultResponseModel = ApiResponseData<boolean>

export type GetDocumentCompareUndefinedResponseModel = ApiResponseData<DocumentCompareUndefinedModel>

export type PatchDocumentCompareUndefinedResponseModel = ApiResponseData<boolean>

export interface BatchDetailModel {
  id: number
  dossierName: string
  bizType: BusinessTypeEnum
  status: DocumentStatusEnum
  handleBy: string
  approveBy: string
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
