import {
  ExtractClassifyResponseModel,
  ExtractDocumentResponseModel,
  ExtractDossierPostResponseModel,
  ExtractDossierResponseModel,
  ExtractHistoryResponseModel,
  ExtractNotePostResponseModel,
  ExtractNoteResponseModel
} from '@/@types/pages/extract/service/ExtractResponse'
import { request } from '@/api/service'
import {
  ExtractPostDossierRequestModel,
  ExtractPostNoteRequestModel
} from '@/@types/pages/extract/service/ExtractRequest'

export function getDossierListApi(id: number) {
  return request<ExtractDossierResponseModel>({
    url: `dossier-docs`,
    method: 'get',
    params: { batchId: id }
  })
}
export function getDossierDetailApi(id: number) {
  return request<ExtractDocumentResponseModel>({
    url: `doc-data`,
    method: 'get',
    params: { dossierDocId: id }
  })
}
export function getDossierHistoriesApi(id: number) {
  return request<ExtractHistoryResponseModel>({
    url: `extraction-logs`,
    method: 'get',
    params: { dossierDocId: id }
  })
}
export function postDossierNoteApi(data: ExtractPostNoteRequestModel) {
  return request<ExtractNotePostResponseModel>({
    url: `note`,
    method: 'post',
    data
  })
}
export function getDossierNotesApi(id: number) {
  return request<ExtractNoteResponseModel>({
    url: `note`,
    method: 'get',
    params: { batchId: id }
  })
}
export function saveDossierDocApi(id: number, data: ExtractPostDossierRequestModel[]) {
  return request<ExtractDossierPostResponseModel>({
    url: `dossier-docs/${id}/validated`,
    method: 'patch',
    data
  })
}
export function getDossierClassifyApi(id: number) {
  return request<ExtractClassifyResponseModel>({
    url: `dossier-files`,
    method: 'get',
    params: { batchId: id }
  })
}
// export function getDossierClassifyApi(): Promise<ExtractClassifyResponseModel> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       return resolve({
//         code: 1,
//         data: DOSSIER_CLASSIFY as ExtractClassifyModel[],
//         msg: ''
//       })
//     }, 500)
//   })
// }
