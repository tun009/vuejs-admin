export interface ExtractPostNoteRequestModel {
  content: string
  batchId: number
}
export interface ExtractPostDossierTableModel {
  docDataId: number | null
  key: string
  value: string
  rowNum: number
}
export interface ExtractPostDossierRequestModel {
  docDataId: number
  value: string
  structuredTableValues: ExtractPostDossierTableModel[]
}
export interface ExtractPostClassifyRequestModel {
  documentType: string
  pages: number[]
}
