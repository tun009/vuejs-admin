import { BaseResponseModel } from '@/@types/common'
import { ExtractDocumentModel, ExtractDossierModel } from '..'

export type ExtractDossierResponseModel = BaseResponseModel<ExtractDossierModel[]>
export type ExtractDocumentResponseModel = BaseResponseModel<ExtractDocumentModel>
