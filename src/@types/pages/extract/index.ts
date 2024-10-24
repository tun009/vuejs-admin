export enum DossierStatusEnum {
  ACTIVE,
  UNACTIVE,
  BLOCK
}
export interface ExtractResultOcrModel {
  confidence: number
  available: number
  name: string
  modified: boolean
  extractionValue: string
  validatedValue: string
  type: string
  key: string
  bboxIds: number[]
}
export interface ExtractBboxModel {
  bbox: number[][]
  id: number
  page_id: number
  value: string
}
export interface ExtractDossierModel {
  id: number
  stt: number
  name: string
  status: string | number
}
export interface ExtractDocumentModel {
  id: number
  file: string
  name: string
  status: DossierStatusEnum
  result: {
    bboxes: ExtractBboxModel[]
    data: ExtractResultOcrModel[]
  }
}
export interface ExtractHistoryAction {
  field: string
  before: string
  after: string
  type: string
}
export interface ExtractHistoryDetail {
  time: string
  user: string
  role: string
  actions: ExtractHistoryAction[]
}
export interface ExtractHistoryModel {
  date: string
  histories: ExtractHistoryDetail[]
}
export interface ExtractNoteModel {
  stt: number
  content: string
  create_at: string
  create_by: string
}
export interface ExtractClassifyFileModel {
  id: number
  name: string
  size: number
  mimetype: string
  rawFile: string
  pageNums: number
}
export interface ExtractClassifyResultModel {
  confidence: number
  name: string
  documentType: string
  pages: number[]
  images: never[]
}
export interface ExtractClassifyModel {
  id: number
  file: ExtractClassifyFileModel
  result: ExtractClassifyResultModel[]
}
