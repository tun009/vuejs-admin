import { DocumentResultEnum } from '@/@types/pages/docs/documents'
import { GetDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import {
  GetCheckersResponseModel,
  GetDocumentFileResponseModel,
  GetDocumentResponseModel,
  GetDocumentResultsResponseModel
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

export function getDocumentFiles(): Promise<GetDocumentFileResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: Array.from({ length: 10 }, (_, index) => ({
            createdAt: '01-01-2025',
            createdBy: '01-01-2025',
            fileName: '1012ILSEIB210069_NGUY....',
            id: index + 1,
            status: 'Mới',
            stt: index + 1
          })),
          pageNum: 0,
          pageSize: 10,
          total: 10
        },
        msg: 'Meo'
      })
    }, 2000)
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
