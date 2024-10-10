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
              amount: '100.000 USD',
              businessType: BUSINESS_TYPE_LIST[Math.floor(Math.random() * 2)],
              cif: 'CIF Meo',
              completionDate: '01-01-2025',
              createdAt: '01-01-2025',
              createdBy: '01-01-2025',
              customerName: 'Meo ' + `${index + 1}`,
              documentName: '1012ILSEIB210069_NGUY....',
              handler: HANDLER_LIST[Math.floor(Math.random() * 2)],
              id: index + 1,
              processingStep: PROCESSING_STEP_LIST[Math.floor(Math.random() * 4)],
              result: DOCUMENT_RESULT_LIST[Math.floor(Math.random() * 2)],
              sol: 'SOL Meo',
              status: DOCUMENT_STATUS_LIST[Math.floor(Math.random() * 14)],
              stt: index + 1
            })),
            params.pageNum,
            params.pageSize
          ),
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          total: 3124
        },
        message: 'Meo'
      })
    }, 2000)
  })
}
