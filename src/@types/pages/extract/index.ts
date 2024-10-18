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
