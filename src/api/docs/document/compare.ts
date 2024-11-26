import {
  UpdateDictionaryRequestModel,
  UpdateDocumentStatusModel
} from '@/@types/pages/docs/documents/services/DocumentRequest'
import {
  GetDocumentCompareResponseModel,
  TranslateEnglishToVietnameseResponseModel
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
