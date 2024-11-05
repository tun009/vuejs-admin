import {
  ExtractClassifyModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractHistoryModel,
  ExtractNoteModel,
  ExtractNotePostModel
} from '..'

export type ExtractDossierResponseModel = ApiResponseData<ExtractDossierModel[]>
export type ExtractDocumentResponseModel = ApiResponseData<ExtractDocumentModel>
export type ExtractHistoryResponseModel = ApiResponseData<ExtractHistoryModel[][]>
export type ExtractNoteResponseModel = ApiResponseData<ExtractNoteModel[]>
export type ExtractClassifyResponseModel = ApiResponseData<ExtractClassifyModel[]>
export type ExtractNotePostResponseModel = ApiResponseData<ExtractNotePostModel>
export type ExtractDossierPostResponseModel = ApiResponseData<number>
