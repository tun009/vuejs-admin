/**  Singleton service giúp khởi tạo service worker pdf một lần duy nhất, load PDF và cache data cho những lần sau **/
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'
class PDFService {
  private pdfDocument: pdfjs.PDFDocumentProxy | null = null

  private constructor() {}

  private static instance: PDFService

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService()
    }
    return PDFService.instance
  }

  public async loadDocument(url: string): Promise<pdfjs.PDFDocumentProxy> {
    if (this.pdfDocument) {
      return this.pdfDocument
    }

    try {
      const loadedDocument = await pdfjs.getDocument(url).promise
      this.pdfDocument = loadedDocument
      return loadedDocument
    } catch (error) {
      console.error('Error loading PDF document:', error)
      throw error
    }
  }

  public getDocument(): pdfjs.PDFDocumentProxy | null {
    return this.pdfDocument
  }

  public clearDocument() {
    this.pdfDocument = null
  }
}

export const pdfService = PDFService.getInstance()
