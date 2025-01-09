import {
  ExtractClassifyResponseModel,
  ExtractDocumentResponseModel,
  ExtractDossierPostResponseModel,
  ExtractDossierResponseModel,
  ExtractHistoryResponseModel,
  ExtractNotePostResponseModel,
  ExtractNoteResponseModel,
  DocumentTypeResponseModel,
  ExtractSettingResponseModel,
  ExtractGetStatusDocResponseModel
} from '@/@types/pages/extract/service/ExtractResponse'
import { request } from '@/api/service'
import {
  ExtractPostDossierRequestModel,
  ExtractPostNoteRequestModel,
  ExtractPostClassifyRequestModel
} from '@/@types/pages/extract/service/ExtractRequest'

export function getDossierListApi(id: string | number, docType?: string) {
  return request<ExtractDossierResponseModel>({
    url: `dossier-docs`,
    method: 'get',
    params: { batchId: id, ...(docType ? { docType } : {}) }
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
export function getDossierClassifyApi(id: number | string) {
  return request<ExtractClassifyResponseModel>({
    url: `dossier-files`,
    method: 'get',
    params: { batchId: id }
  })
}
export function getDocummentTypeApi() {
  return request<DocumentTypeResponseModel>({
    url: `doc-types`,
    method: 'get'
  })
}
export function saveDossierClassifyApi(id: number, data: ExtractPostClassifyRequestModel[]) {
  return request<ExtractDossierPostResponseModel>({
    url: `dossier-files/${id}/validated`,
    method: 'patch',
    data
  })
}
export function replaceDocument(data: FormData, id: number) {
  return request<ExtractDossierPostResponseModel>({
    url: `dossier-docs/${id}/replace`,
    method: 'patch',
    data
  })
}
export function comparisonDocumentApi(id: number) {
  return request<ExtractDossierPostResponseModel>({
    url: `batches/${id}/comparison`,
    method: 'patch'
  })
}
export function ocrDocumentApi(id: number) {
  return request<ExtractDossierPostResponseModel>({
    url: `dossier-docs/${id}/ocr`,
    method: 'patch'
  })
}
export function getExtractConfidence() {
  return request<ExtractSettingResponseModel>({
    url: 'confidence-config',
    method: 'get'
  })
}
export function getStatusDocument(id: number) {
  return request<ExtractGetStatusDocResponseModel>(
    {
      url: `dossier-docs/${id}/status`,
      method: 'get'
    },
    { showError: false }
  )
}
