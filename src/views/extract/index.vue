<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getDossierDetailApi, getDossierListApi } from '@/api/extract'
import {
  ExtractBboxModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractResultOcrModel
} from '@/@types/pages/extract'
import PDFView from './components/PDFView.vue'
import { renderLabelByValue } from '@/utils/common'
import { documentStatusOptions } from '@/@types/pages/docs/documents'
import { ArrowLeft, More } from '@element-plus/icons-vue'
const dossierListData = ref<ExtractDossierModel[]>([])
const docementDetail = ref<ExtractDocumentModel>()
const bboxsIDs = ref<ExtractBboxModel[]>([])
const activeName = ref('ocr')
const fieldSelect = ref('')
const pdfViewRef = ref()
const getDossiersList = async () => {
  try {
    const response = await getDossierListApi()
    dossierListData.value = response.data.map((item) => {
      return {
        ...item,
        status: renderLabelByValue(documentStatusOptions, item.status)
      }
    })
  } catch (error: any) {
    throw new Error(error)
  }
}
const getDossiersDetail = async () => {
  try {
    const response = await getDossierDetailApi()
    docementDetail.value = response.data
    bboxsIDs.value = response.data?.result?.bboxes
    // const { pdf: pdfRef, pages: pagesRef } = usePDF(response.data?.file)
    // // console.log(pdf, pages)
    // pdfDoc.value = { ...pdfRef.value }
    // pagesDoc.value = pagesRef.value
    // console.log(pdfDoc, 'pdfDoc')
    // console.log(pagesDoc, 'pagesDoc')
  } catch (error: any) {
    throw new Error(error)
  }
}
const handleClickField = (item: ExtractResultOcrModel) => {
  fieldSelect.value = item.key
  const bbox = bboxsIDs.value.filter((box) => box.id === (item.bboxIds[0] ?? ''))
  if (bbox.length > 0) pdfViewRef.value?.tagLabelToPage(bbox[0])
}
const renderClassOcr = (conf: number) => {
  return conf > 0.75 ? 'trust-hight' : 'trust-medium'
}
const formatNumberConfidence = (num: number) => {
  if (Number.isInteger(num * 100)) {
    return num.toString()
  } else {
    return Math.round(num * 10 * 100) / 10
  }
}
const renderColorOcr = (cd: number) => {
  if (cd === 0) return '#7a8da5'
  else if (cd <= 25) return '#C4190D'
  else if (cd <= 75) return '#f76707'
  else if (cd <= 90) return '#1c7ed6'
  else return '#0ca678'
}
const isLoadedPdf = ref<boolean>(false)
const onLoadedPDF = () => {
  isLoadedPdf.value = true
}
onMounted(() => {
  getDossiersList()
  getDossiersDetail()
})
</script>

<template>
  <div>
    <div class="flex h-screen text-[14px] extract-page">
      <div class="w-[70%]">
        <div class="flex flex-row h-full">
          <div class="w-[180px]">
            <div class="p-[16px] px-[20px] btn-go-back">
              <el-button :icon="ArrowLeft" class="text-[#005d98] border-[#005d98]">Trở lại</el-button>
            </div>
            <div
              v-for="(item, index_ds) in dossierListData"
              :key="index_ds"
              class="p-3 border-b-[1px] border-b-[#e9ecef] text-[13px] text-[#868e96]"
              :class="{ 'dossier-active bg-[#e7f5ff]': index_ds === 1 }"
            >
              <div>{{ item.name }}</div>
              <div class="mt-2 flex items-center">
                <span class="w-[8px] h-[8px] bg-[#1098ad] rounded-full mr-[4px]" />
                <span>{{ item.status }}</span>
              </div>
            </div>
          </div>
          <div class="overflow-auto w-[100%] bg-[#f1f3f5] px-2">
            <PDFView
              v-if="docementDetail?.file"
              ref="pdfViewRef"
              :url="docementDetail?.file"
              @loaded-data="onLoadedPDF()"
            />
          </div>
        </div>
      </div>
      <div class="w-[30%]">
        <div class="flex justify-between py-6 px-4 font-medium items-center">
          <span>{{ docementDetail?.name }}</span>
          <el-button :icon="More" class="p-[8px]" />
        </div>
        <el-tabs class="tabs-infor" v-model="activeName">
          <el-tab-pane label="Kết quả OCR" name="ocr">
            <div v-if="(docementDetail?.result?.data ?? []).length > 0">
              <template v-if="isLoadedPdf">
                <div
                  v-for="(item, index) in docementDetail?.result.data"
                  :key="index"
                  class="mt-[12px] py-[5px] px-[6px] item-dossier cursor-pointer"
                  :class="renderClassOcr(item.confidence)"
                  @click="handleClickField(item)"
                >
                  <div class="mx-[16px] border-l-[2px] border-solid">
                    <div class="ml-[16px]">
                      <div class="flex">
                        <span
                          class="text-[#fff] rounded-[3px] px-[4px] text-[12px] py-[2px] font-medium"
                          :style="{
                            backgroundColor: renderColorOcr(item.confidence * 100)
                          }"
                        >
                          {{ formatNumberConfidence(item.confidence) }}%
                        </span>
                        <span class="ml-2 text-[#adb5bd]">{{ item.key }}</span>
                      </div>
                      <div class="mt-[8px] min-h-[12px]">
                        <div v-if="item.key === 'goods_table'">Click để xem</div>
                        <el-input v-else-if="fieldSelect === item.key" v-model="item.extractionValue" />
                        <div v-else>{{ item.extractionValue }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="(item, index) in docementDetail?.result.data"
                  :key="index"
                  class="mt-[12px] py-[5px] px-[6px] item-dossier cursor-wait"
                >
                  <div class="mx-[16px] border-l-[2px] border-solid">
                    <div class="ml-[16px]">
                      <div class="flex">
                        <span
                          class="text-[#fff] rounded-[3px] px-[4px] text-[12px] py-[2px] font-medium"
                          :style="{
                            backgroundColor: renderColorOcr(0)
                          }"
                        >
                          {{ formatNumberConfidence(0) }}%
                        </span>
                        <span class="ml-2 text-[#adb5bd]">{{ item.key }}</span>
                      </div>
                      <div class="mt-[8px] min-h-[12px]">
                        <el-skeleton class="w-full" animated>
                          <template #template>
                            <el-skeleton-item variant="text" class="w-full" />
                          </template>
                        </el-skeleton>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Lịch sử chỉnh sửa" name="history">Lịch sử chỉnh sửa</el-tab-pane>
          <el-tab-pane label="Ghi chú" name="note">Ghi chú</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.extract-page {
  .el-tabs__nav-scroll {
    padding: 0 16px;
  }
  .btn-go-back {
    box-shadow:
      inset -1px 0 0 0 #ebebeb,
      0 2px 4px 0 #aaa;
  }
  .el-tabs__item:not(.is-active) {
    color: #adb5bd;
  }
  .trust-hight > div {
    border-color: #0c8599;
  }
  .trust-medium > div {
    border-color: #ee0033;
  }
  .item-dossier:hover {
    background-color: #e1edfe;
  }
}
</style>
