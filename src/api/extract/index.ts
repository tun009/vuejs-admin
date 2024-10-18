import {
  ExtractDocumentResponseModel,
  ExtractDossierResponseModel
} from '@/@types/pages/extract/service/ExtractResponse'
import { ExtractDocumentModel, ExtractDossierModel } from '@/@types/pages/extract'
import { DOSSIER_DOCUMENT, DOSSIER_LIST } from '@/mocks/extract'

export function getDossierListApi(): Promise<ExtractDossierResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: DOSSIER_LIST as ExtractDossierModel[],
        message: ''
      })
    }, 500)
  })
}
export function getDossierDetailApi(): Promise<ExtractDocumentResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: DOSSIER_DOCUMENT as ExtractDocumentModel,
        message: ''
      })
    }, 500)
  })
}
