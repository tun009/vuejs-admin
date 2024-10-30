import { DocumentResultEnum } from '@/@types/pages/docs/documents'
import {
  GetDocumentRequestModel,
  UpdateBatchAmountRequestModel,
  UpdateDocumentRequestModel
} from '@/@types/pages/docs/documents/services/DocumentRequest'
import {
  GetBranchResponseModel,
  GetBatchDetailResponseModel,
  GetCheckersResponseModel,
  GetDocumentDetailResponseModel,
  GetDocumentFileResponseModel,
  GetDocumentResponseModel,
  GetDocumentResultsResponseModel,
  GetDocumentLCDetailResponseModel
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

export function getDocumentResults(): Promise<GetDocumentResultsResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: Array.from({ length: 4 }, (_, index) => ({
            fileName: 'Invoice',
            id: index + 1,
            numberSatisfiesRequirement: '8/8',
            testResults: DocumentResultEnum.COMPLIED
          })),
          pageNum: 0,
          pageSize: 4,
          total: 4
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}

export function getCheckers(): Promise<GetCheckersResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: Array.from({ length: 5 }, (_, index) => ({
            id: index + 1,
            name: 'Nguyễn Tấn D',
            username: 'nt.d'
          })),
          pageNum: 0,
          pageSize: 5,
          total: 5
        },
        msg: 'Meo'
      })
    }, 2000)
  })
}
