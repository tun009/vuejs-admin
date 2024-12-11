import { UpdateDocumentCompareUndefinedModel } from '@/@types/pages/docs/documents'
import {
  PatchDocumentCompareUndefinedRequestModel,
  UpdateDictionaryRequestModel,
  UpdateDocumentCompareResultTableRequestModel,
  UpdateDocumentCompareResultRequestModel,
  UpdateDocumentStatusModel
} from '@/@types/pages/docs/documents/services/DocumentRequest'
import {
  GetDocumentCompareResponseModel,
  GetDocumentCompareUndefinedResponseModel,
  PatchDocumentCompareUndefinedResponseModel,
  RetryDocumentResponseModel,
  TranslateEnglishToVietnameseResponseModel,
  UpdateDocumentCompareResultResponseModel
} from '@/@types/pages/docs/documents/services/DocumentResponse'
import { request } from '@/api/service'

export function getDocumentCompare(params: { batchId: number | string; key: string }) {
  return request<GetDocumentCompareResponseModel>({
    url: 'comparison',
    method: 'get',
    params
  })
}

export function updateDocumentStatus(batchId: number | string, data: UpdateDocumentStatusModel) {
  return request<GetDocumentCompareResponseModel>({
    url: 'batches/' + batchId + '/approve',
    method: 'patch',
    data
  })
}

export function translateEnglishToVietnamese(data: { content: string }) {
  return request<TranslateEnglishToVietnameseResponseModel>({
    url: 'nlp/translate',
    method: 'post',
    data
  })
}

export function updateDictionary(id: number | string, data: UpdateDictionaryRequestModel) {
  return request<TranslateEnglishToVietnameseResponseModel>({
    url: 'dictionaries/' + id,
    method: 'put',
    data
  })
}

export function updateCompareResult(data: UpdateDocumentCompareResultRequestModel) {
  return request<UpdateDocumentCompareResultResponseModel>({
    url: 'comparison/update-result',
    method: 'patch',
    data
  })
}

export function updateCompareResultTable(data: UpdateDocumentCompareResultTableRequestModel) {
  return request<UpdateDocumentCompareResultResponseModel>({
    url: 'comparison/update-result-table',
    method: 'patch',
    data
  })
}

export function getDocumentCompareUndefined(params: { comparisonUndefinedId: string | number }) {
  return request<GetDocumentCompareUndefinedResponseModel>({
    url: 'comparison/summary-comparison-undefined',
    method: 'get',
    params
  })
}

export function updateDocumentCompareUndefined(data: UpdateDocumentCompareUndefinedModel) {
  return request<GetDocumentCompareUndefinedResponseModel>({
    url: 'comparison/update-undefined-requirements',
    method: 'put',
    data
  })
}

export function patchDocumentCompareUndefined(
  comparisonUndefinedId: string | number,
  data: PatchDocumentCompareUndefinedRequestModel
) {
  return request<PatchDocumentCompareUndefinedResponseModel>({
    url: 'comparison/' + comparisonUndefinedId + '/undefined-requirements',
    method: 'patch',
    data
  })
}

export function retryComparisonDocument(id: number) {
  return request<RetryDocumentResponseModel>({
    url: `batches/${id}/comparison`,
    method: 'patch'
  })
}

export function retryOcrDocument(id: number) {
  return request<RetryDocumentResponseModel>({
    url: `batches/${id}/ocr`,
    method: 'patch'
  })
}
