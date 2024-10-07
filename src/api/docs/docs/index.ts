import {
  BUSINESS_TYPE_LIST,
  DOCUMENT_RESULT_LIST,
  DOCUMENT_STATUS_LIST,
  DocumentModel,
  HANDLER_LIST,
  PROCESSING_STEP_LIST
} from '@/@types/pages/docs/documents'
import { GetDocumentRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
import { GetDocumentResponseModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { getDataWithPagination } from '@/utils/common'

export function getDocuments(params: GetDocumentRequestModel): Promise<GetDocumentResponseModel> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve({
        code: 1,
        data: {
          list: getDataWithPagination<DocumentModel>(
            Array.from({ length: 3124 }, (_, index) => ({
              id: index + 1,
              stt: index + 1,
              documentName: '1012ILSEIB210069_NGUY....',
              businessType: BUSINESS_TYPE_LIST[Math.floor(Math.random() * 2)],
              status: DOCUMENT_STATUS_LIST[Math.floor(Math.random() * 14)],
              handler: HANDLER_LIST[Math.floor(Math.random() * 2)],
              processingStep: PROCESSING_STEP_LIST[Math.floor(Math.random() * 4)],
              result: DOCUMENT_RESULT_LIST[Math.floor(Math.random() * 2)],
              completioDate: '01-01-2025',
              sol: 'SOL Meo',
              cif: 'CIF Meo',
              customerName: 'Meo ' + `${index + 1}`,
              amount: '100.000 USD',
              createdAt: '01-01-2025',
              createdBy: '01-01-2025'
            })),
            params.pageNum,
            params.pageSize
          ),
          total: 3124,
          pageNum: params.pageNum,
          pageSize: params.pageSize
        },
        message: 'Meo'
      })
    }, 2000)
  })
}
