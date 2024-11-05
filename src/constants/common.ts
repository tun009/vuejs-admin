import { DocumentStatusEnum } from '@/@types/common'

export const PASSWORD_DEFAULT = 'Eximbank123@'
export const PAGE_SIZE_LIST_DEFAULT = [10, 20, 50]
export const MAX_FILE_SIZE = 16 * 1024 * 1024
export const MAX_FILE_LIMIT = 10

export const processingDocumentStatus = [
  DocumentStatusEnum.NEW,
  DocumentStatusEnum.CLASSIFYING,
  DocumentStatusEnum.CLASSIFIED,
  DocumentStatusEnum.OCRING
]
