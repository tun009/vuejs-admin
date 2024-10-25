export enum DossierStatusEnum {
  ACTIVE,
  UNACTIVE,
  BLOCK
}
export interface ExtractResultOcrModel {
  id: number
  confidence?: number
  coreKey: string
  extractionValue: string
  validatedValue: string
  type: string
  bboxes: number[][][]
  pageId: number
}
export interface ExtractDossierTypeModel {
  id: number
  name: string
  key: string
  type: string
}
export interface ExtractDossierModel {
  id: number
  docType: ExtractDossierTypeModel
  status: string | number
}
export interface ExtractDocumentModel {
  id: number
  docType: string
  pathFile: string
  fileName: string
  result: ExtractResultOcrModel[][]
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
