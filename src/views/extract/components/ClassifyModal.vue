<script lang="ts" setup>
import { ExtractClassifyModel } from '@/@types/pages/extract'
import { getDossierClassifyApi } from '@/api/extract'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { ref } from 'vue'
const dataDetail = ref<ExtractClassifyModel[]>([])
// let pdfExtract = ref<PDFDocumentLoadingTask | undefined>(undefined) as ShallowRef<PDFDocumentLoadingTask | undefined>
let pdfExtract: any
const getDossierById = async () => {
  try {
    const response = await getDossierClassifyApi()
    dataDetail.value = response.data
    const { pdf } = usePDF(dataDetail.value[0]?.file?.rawFile)
    pdfExtract = pdf
  } catch (error: any) {
    throw new Error(error)
  }
}
interface ExtractPdfViewExpose {
  getDossierById: () => void
}
defineExpose<ExtractPdfViewExpose>({
  getDossierById
})
</script>
<template>
  <div class="flex h-[90vh]">
    <div class="w-[40%]" style="border: 1px solid #e7eaed">
      <div v-if="dataDetail.length > 0" class="h-[100%] overflow-auto">
        <div v-for="(doc, index_doc) in dataDetail[0]?.result" :key="index_doc">
          <span>{{ doc.name }}</span>
          <div class="ml-[10px]" v-for="(doc_page, index_doc_page) in doc.pages" :key="index_doc_page">
            <VuePDF :pdf="pdfExtract" :page="doc_page + 1" :width="300" />
            Trang {{ doc_page + 1 }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-[60%]" style="border: 1px solid #e7eaed" />
  </div>
</template>
