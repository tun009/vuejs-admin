import { BaseResponseModel } from '@/@types/common'
import {
  ExtractClassifyModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractHistoryModel,
  ExtractNoteModel
} from '..'

export type ExtractDossierResponseModel = BaseResponseModel<ExtractDossierModel[]>
export type ExtractDocumentResponseModel = BaseResponseModel<ExtractDocumentModel>
export type ExtractHistoryResponseModel = BaseResponseModel<ExtractHistoryModel[]>
export type ExtractNoteResponseModel = BaseResponseModel<ExtractNoteModel[]>
export type ExtractClassifyResponseModel = BaseResponseModel<ExtractClassifyModel[]>
