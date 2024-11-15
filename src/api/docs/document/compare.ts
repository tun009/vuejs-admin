import { GetDocumentCompareResponseModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { request } from '@/api/service'

export function getDocumentCompare(params: { batchId: number | string; key: string }) {
  return request<GetDocumentCompareResponseModel>({
    url: 'comparison',
    method: 'get',
    params
  })
}
