import { DocumentStatusEnum } from '@/@types/common'
import { CompareHistoryTypeEnum, DocumentExportFileEnum } from '@/@types/pages/docs/documents'

export const PASSWORD_DEFAULT = 'Eximbank123@'
export const PAGE_SIZE_LIST_DEFAULT = [10, 20, 50]
export const MAX_FILE_SIZE = 16 * 1024 * 1024
export const MAX_FILE_LIMIT = 10
export const MAX_FILE_SINGLE_LIMIT = 1
export const TABLE_COLUMN_WIDTH_DEFAULT = 250

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
  DocumentStatusEnum.OCRING
]
