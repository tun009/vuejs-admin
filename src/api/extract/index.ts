import {
  ExtractClassifyResponseModel,
  ExtractDocumentResponseModel,
  ExtractDossierResponseModel,
  ExtractHistoryResponseModel,
  ExtractNoteResponseModel
} from '@/@types/pages/extract/service/ExtractResponse'
import { ExtractClassifyModel, ExtractHistoryModel, ExtractNoteModel } from '@/@types/pages/extract'
import { DOSSIER_CLASSIFY, HISTORIES_TAB, NOTES_TAB } from '@/mocks/extract'
import { request } from '@/api/service'

// export function getDossierListApi(): Promise<ExtractDossierResponseModel> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       return resolve({
//         code: 1,
//         data: DOSSIER_LIST as ExtractDossierModel[],
//         msg: ''
//       })
//     }, 500)
//   })
// }
export function getDossierListApi(id: number) {
  return request<ExtractDossierResponseModel>({
    url: `dossier-docs`,
    method: 'get',
    params: { batchId: id }
  })
}
// export function getDossierDetailApi(): Promise<ExtractDocumentResponseModel> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       return resolve({
//         code: 1,
//         data: DOSSIER_DOCUMENT as ExtractDocumentModel,
//         msg: ''
//       })
//     }, 500)
//   })
// }
export function getDossierDetailApi(id: number) {
  return request<ExtractDocumentResponseModel>({
    url: `doc-data`,
    method: 'get',
    params: { dossierDocId: id }
  })
}
export function getDossierHistoriesApi(): Promise<ExtractHistoryResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: HISTORIES_TAB as ExtractHistoryModel[],
        msg: ''
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
        msg: ''
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
        msg: ''
      })
    }, 500)
  })
}
