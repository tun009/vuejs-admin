import { DocumentExportFileEnum } from '@/@types/pages/docs/documents'
import {
  GetDocumentRequestModel,
  UpdateBatchAmountRequestModel,
  UpdateDocumentRequestModel,
  UpdateLCAmountRequestModel
} from '@/@types/pages/docs/documents/services/DocumentRequest'
import {
  GetBatchDetailResponseModel,
  GetBranchResponseModel,
  GetDocumentDataLCResponseModel,
  GetDocumentDetailResponseModel,
  GetDocumentFileResponseModel,
  GetDocumentHistoryResponseModel,
  GetDocumentLCAmountResponseModel,
  GetDocumentLCDetailResponseModel,
  GetDocumentResponseModel,
  GetDocumentSummaryResponseModel,
  PutPresentationCheckerResponseModel
} from '@/@types/pages/docs/documents/services/DocumentResponse'
import { request } from '@/api/service'

/** get document */
export function getDocuments(data: GetDocumentRequestModel) {
  return request<GetDocumentResponseModel>({
    url: 'batches/query',
    method: 'post',
    data
  })
}

/** update document */
export function updateDocument(data: UpdateDocumentRequestModel) {
  return request<GetDocumentDetailResponseModel>({
    url: 'batches/update',
    method: 'put',
    data
  })
}

export function deleteDocument(ids: (string | number)[]) {
  return request<GetDocumentDetailResponseModel>({
    url: 'batches/delete?' + ids.map((id) => `ids=${id}`).join('&'),
    method: 'delete'
  })
}

export function addDocument(data: FormData) {
  return request<GetDocumentDetailResponseModel>({
    url: 'batches/create',
    method: 'post',
    data
  })
}

export function getBatchDetail(id: string | number) {
  return request<GetBatchDetailResponseModel>({
    url: 'batches/' + id,
    method: 'get'
  })
}

export function getDocumentFiles(params: { batchId: string | number }) {
  return request<GetDocumentFileResponseModel>({
    url: 'dossier-files',
    method: 'get',
    params
  })
}

export function deleteDocumentFile(id: string | number) {
  return request<ApiResponseData<number>>({
    url: 'dossier-files/' + id,
    method: 'delete'
  })
}

export function getBranches() {
  return request<GetBranchResponseModel>({
    url: 'branches',
    method: 'get'
  })
}

export function getLCDetail(id: number | string) {
  return request<GetDocumentLCDetailResponseModel>({
    url: 'batches/details/' + id,
    method: 'get'
  })
}

export function updateBatchAmount(data: UpdateBatchAmountRequestModel) {
  return request<GetDocumentLCDetailResponseModel>({
    url: 'batches/update-amount',
    method: 'put',
    data
  })
}

export function getLCAmount(params: { batchId: number | string }) {
  return request<GetDocumentLCAmountResponseModel>({
    url: 'dossiers/amount',
    method: 'get',
    params
  })
}

export function updateLCAmount(data: UpdateLCAmountRequestModel) {
  return request<GetDocumentLCAmountResponseModel>({
    url: 'dossiers/update-amount',
    method: 'put',
    data
  })
}

export function getDocumentDataLC(params: { batchId: number | string }) {
  return request<GetDocumentDataLCResponseModel>({
    url: 'doc-data/lc',
    method: 'get',
    params
  })
}

export function putPresentationChecker(batchId: string | number, params: { checkerId: number | string }) {
  return request<PutPresentationCheckerResponseModel>({
    url: 'batches/' + batchId + '/submission',
    method: 'patch',
    params
  })
}

export function getDocumentSummary(params: { batchId: string | number }) {
  return request<GetDocumentSummaryResponseModel>({
    url: 'comparison/summary',
    method: 'get',
    params
  })
}

export function downloadDocumentFile(batchId: string | number, params: { type: DocumentExportFileEnum }) {
  return request({
    url: 'batches/' + batchId + '/>download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

export function getDocumentHistories(batchId: string | number) {
  return request<GetDocumentHistoryResponseModel>({
    url: 'comparison-log/' + batchId,
    method: 'get'
  })
}
