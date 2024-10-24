import {
  ExtractClassifyResponseModel,
  ExtractDocumentResponseModel,
  ExtractDossierResponseModel,
  ExtractHistoryResponseModel,
  ExtractNoteResponseModel
} from '@/@types/pages/extract/service/ExtractResponse'
import {
  ExtractClassifyModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractHistoryModel,
  ExtractNoteModel
} from '@/@types/pages/extract'
import { DOSSIER_CLASSIFY, DOSSIER_DOCUMENT, DOSSIER_LIST, HISTORIES_TAB, NOTES_TAB } from '@/mocks/extract'

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
export function getDossierHistoriesApi(): Promise<ExtractHistoryResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: HISTORIES_TAB as ExtractHistoryModel[],
        message: ''
      })
    }, 500)
  })
}
export function getDossierNotesApi(): Promise<ExtractNoteResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: NOTES_TAB as ExtractNoteModel[],
        message: ''
      })
    }, 500)
  })
}
export function getDossierClassifyApi(): Promise<ExtractClassifyResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: DOSSIER_CLASSIFY as ExtractClassifyModel[],
        message: ''
      })
    }, 500)
  })
}
