import { DocumentStatusEnum } from '@/@types/common'
import { CompareHistoryTypeEnum, DocumentExportFileEnum } from '@/@types/pages/docs/documents'
export const PASSWORD_DEFAULT = 'Eximbank123@'
export const PAGE_SIZE_LIST_DEFAULT = [10, 20, 50]
export const MAX_FILE_SIZE = 16 * 1024 * 1024
export const MAX_FILE_LIMIT = 10
export const MAX_FILE_SINGLE_LIMIT = 1
export const TABLE_COLUMN_WIDTH_DEFAULT = 250
export const confirmButtonDeleteClass =
  'bg-[#fff] hover:bg-[#fff] border-[#c92a2a] hover:border-[#c92a2a] hover:text-[#c92a2a] text-[#c92a2a]'
export const KEEP_ALIVE_ROUTER_NAME = ['Document']
export const PAGINATION_DEFAULT = {
  pageNum: 0,
  pageSize: 10
}
export const SOCKET_PATH = 'eximbank-socket'

export const BLOB_EXPORT_TYPES = {
  [DocumentExportFileEnum.DOCX]: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  [DocumentExportFileEnum.PDF]: 'application/pdf',
  [DocumentExportFileEnum.EXCEL]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export const DOCUMENT_HISTORY_MESSAGES = {
  [CompareHistoryTypeEnum.CHECKED]: 'Xác nhận kết quả bộ chứng từ',
  [CompareHistoryTypeEnum.VALIDATED]: 'Phê duyệt kết quả bộ chứng từ',
  [CompareHistoryTypeEnum.DENIED]: 'Từ chối bộ chứng từ',
  [CompareHistoryTypeEnum.ADJUST_REQUESTED]: 'Chuyển trả bộ chứng từ về Maker xử lý',
  [CompareHistoryTypeEnum.ADDITIONAL]: '',
  [CompareHistoryTypeEnum.EDIT]: '',
  [CompareHistoryTypeEnum.LC]: ''
}

export const processingDocumentStatus = [
  DocumentStatusEnum.NEW,
  DocumentStatusEnum.CLASSIFYING,
  DocumentStatusEnum.CLASSIFIED,
  DocumentStatusEnum.OCRING,
  DocumentStatusEnum.COMPARING
]

export const endedDocumentStatus = [DocumentStatusEnum.DENIED, DocumentStatusEnum.VALIDATED]

export const errorDocumentStatus = [
  DocumentStatusEnum.CLASSIFICATION_ERROR,
  DocumentStatusEnum.EXTRACTION_ERROR,
  DocumentStatusEnum.COMPARISON_ERROR
]

export const makerStepDocumentStatus = [
  DocumentStatusEnum.WAIT_CHECK,
  DocumentStatusEnum.CHECKING,
  DocumentStatusEnum.CHECKED,
  DocumentStatusEnum.ADJUST_REQUESTED
]

export const checkerStepDocumentStatus = [DocumentStatusEnum.WAIT_VALIDATE, DocumentStatusEnum.VALIDATING]

export const deleteAccessStatus = [
  DocumentStatusEnum.NEW,
  ...makerStepDocumentStatus.slice(0, 3),
  ...errorDocumentStatus
]

export const statusAccessDeleteDocumentStatus = [
  DocumentStatusEnum.NEW,
  DocumentStatusEnum.CLASSIFYING,
  DocumentStatusEnum.CLASSIFIED,
  DocumentStatusEnum.OCRING,
  DocumentStatusEnum.OCRED,
  DocumentStatusEnum.COMPARING,
  ...makerStepDocumentStatus,
  ...errorDocumentStatus
]

export const documentAfterCheckStatus = [
  DocumentStatusEnum.WAIT_VALIDATE,
  DocumentStatusEnum.ADJUST_REQUESTED,
  DocumentStatusEnum.VALIDATED,
  DocumentStatusEnum.VALIDATING,
  DocumentStatusEnum.DENIED
]
export const DATA_LOGIN_DEFAULT = {
  customer: {
    client_id: 4,
    client_secret: 'n5i4xQ0BiUoFoxFzezMQYvqyQLtsRXoI4GiRTDbx'
  },
  admin: {
    client_id: 1,
    client_secret: 'Ye5ISPNTe1n3VHRZefFBykZBZdtAkDpE3lDTqQEj',
    state: 'FMhplpHiIKEtoupJoBxSKB7C27jaepKALAfQeRQ'
  }
}
