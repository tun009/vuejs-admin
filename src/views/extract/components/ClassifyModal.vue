<script lang="ts" setup>
import { ExtractClassifyModel } from '@/@types/pages/extract'
import { getDossierClassifyApi } from '@/api/extract'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { ref } from 'vue'
const dataDetail = ref<ExtractClassifyModel[]>([])
const pageActive = ref<string>()
const baseURL = import.meta.env.VITE_BASE_API
// let pdfExtract = ref<PDFDocumentLoadingTask | undefined>(undefined) as ShallowRef<PDFDocumentLoadingTask | undefined>
const getDossierById = async () => {
  try {
    const response = await getDossierClassifyApi(2852)
    dataDetail.value = response.data
    // const { pdf } = usePDF(`${baseURL}/files?src=${response.data[0].filePath}`)
    // pdfExtract = pdf
    if (dataDetail.value.length > 0) handleCollapseChange(dataDetail.value[0])
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
const activeNames = ref(0)
const activeNamesChild = ref(0)
const handleCollapseChange = (value: ExtractClassifyModel) => {
  const { pdf } = usePDF(`${baseURL}/files?src=${value?.filePath}`)
  if (!value?.pdfEtract) value.pdfEtract = pdf
}
const base64Image = ref('')
const viewPage = (viewPage: string) => {
  const pageElement = document.getElementById(viewPage)
  if (pageElement) {
    pageActive.value = viewPage
    const canvas = pageElement.querySelector('canvas') as HTMLCanvasElement
    if (canvas) {
      base64Image.value = canvas.toDataURL()
    }
  }
}
</script>
<template>
  <div class="flex h-[90vh] classify-modal mx-[-2rem]">
    <div class="w-[40%] border border-gray-300 border-solid">
      <div v-if="dataDetail.length > 0" class="h-[100%] overflow-auto">
        <div class="demo-collapse">
          <el-collapse
            v-model="activeNames"
            v-for="(doc, index_doc) in dataDetail"
            :key="index_doc"
            accordion
            class="custom-collapse"
            @change="handleCollapseChange(doc)"
          >
            <el-collapse-item :name="index_doc">
              <template #title>
                <div class="collapse-header ml-1">
                  {{ doc?.fileName }}
                </div>
              </template>
              <div
                v-for="(doc_result, index_result) in doc.ocrResults"
                :key="index_result"
                class="custom-collapse justify-content-xl-between d-flex"
              >
                <el-collapse class="child-collapse custom-collapse" v-model="activeNamesChild">
                  <el-collapse-item :name="`child_${index_result}`">
                    <template v-slot:title>
                      {{ doc_result.documentType }}
                    </template>
                    <div class="ml-[10px]" v-for="(doc_page, index_doc_page) in doc_result.pages" :key="index_doc_page">
                      <VuePDF
                        :pdf="doc.pdfEtract"
                        :page="doc_page + 1"
                        :width="1500"
                        class="page-extract pt-[5px] mx-auto w-[100px] cursor-pointer"
                        :style="pageActive === `doc${doc.id}page${doc_page}` ? 'border: solid 2px #1864ab' : ''"
                        :id="`doc${doc.id}page${doc_page}`"
                        @click="viewPage('doc' + doc.id + 'page' + doc_page)"
                      />
                      <div class="text-center mt-[5px]">Trang {{ doc_page + 1 }}</div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="w-[60%] image-container border border-gray-300 border-solid">
      <img v-if="base64Image" class="h-[90vh] mx-auto" :src="base64Image" alt="" loading="lazy" />
    </div>
  </div>
</template>
<style lang="scss">
.classify-modal {
  .el-collapse-item__header {
    display: flex;
  }
  .custom-collapse .el-collapse-item__arrow {
    margin-left: 10px;
    order: -1;
  }
  .child-collapse .el-collapse-item__arrow {
    margin-left: 20px;
  }
  .el-collapse-item__content,
  .child-collapse .el-collapse-item__header,
  .image-container {
    background-color: #f1f3f5;
  }
  .page-extract > canvas {
    border: solid 1px #ced4da;
    border-radius: 4px;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
<style lang="css" scoped></style>
