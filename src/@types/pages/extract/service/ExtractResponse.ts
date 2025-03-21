import {
  ExtractClassifyModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractHistoryModel,
  ExtractNoteModel,
  ExtractNotePostModel,
  DocumentTypeModel,
  ExtractDossierPostModel
} from '..'
import { UpdateConfidenceRequestModel } from '../../docs/settings/services/SettingRequest'

export type ExtractDossierResponseModel = ApiResponseData<ExtractDossierModel[]>
export type ExtractDocumentResponseModel = ApiResponseData<ExtractDocumentModel>
export type ExtractHistoryResponseModel = ApiResponseData<ExtractHistoryModel[][]>
export type ExtractNoteResponseModel = ApiResponseData<ExtractNoteModel[]>
export type ExtractClassifyResponseModel = ApiResponseData<ExtractClassifyModel[]>
export type ExtractNotePostResponseModel = ApiResponseData<ExtractNotePostModel>
export type ExtractDossierPostResponseModel = ApiResponseData<ExtractDossierPostModel>
export type DocumentTypeResponseModel = ApiResponseData<DocumentTypeModel[]>
export type ExtractSettingResponseModel = ApiResponseData<UpdateConfidenceRequestModel[]>
export type ExtractGetStatusDocResponseModel = ApiResponseData<boolean>
