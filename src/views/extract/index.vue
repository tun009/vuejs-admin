<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { getDossierDetailApi, getDossierListApi } from '@/api/extract'
import { useConfirmModal } from '@/hooks/useConfirm'
import {
  ExtractBboxModel,
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractResultOcrModel
} from '@/@types/pages/extract'
import PDFView from './components/PDFView.vue'
import HistoryTab from './components/HistoryTab.vue'
import NoteTab from './components/NoteTab.vue'
import ClassifyModal from './components/ClassifyModal.vue'

import EIBDrawer from '@/components/common/EIBDrawer.vue'
import { renderLabelByValue } from '@/utils/common'
import { documentStatusOptions } from '@/@types/pages/docs/documents'
import { ArrowLeft, More, CloseBold, Select } from '@element-plus/icons-vue'
const dossierListData = ref<ExtractDossierModel[]>([])
const documentDetail = ref<ExtractDocumentModel>()
const bboxsIDs = ref<ExtractBboxModel[]>([])
const activeName = ref('ocr')
const fieldSelect = ref('')
const pdfViewRef = ref()
const classifyModalRef = ref()
const openClassifyDrawer = ref(false)
const idDossierActive = ref()
const { showConfirmModal } = useConfirmModal()

const getDossiersList = async () => {
  try {
    const response = await getDossierListApi()
    dossierListData.value = response.data.map((item) => {
      return {
        ...item,
        status: renderLabelByValue(documentStatusOptions, item.status)
      }
    })
    // hard code
    getDossierById(0)
  } catch (error: any) {
    throw new Error(error)
  }
}
const getDossierById = (id: number) => {
  idDossierActive.value = id
  getDossiersDetail()
}
const getDossiersDetail = async () => {
  try {
    documentDetail.value = {} as ExtractDocumentModel
    bboxsIDs.value = []
    const response = await getDossierDetailApi()
    documentDetail.value = response.data
    bboxsIDs.value = response.data?.result?.bboxes
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
const openClassifyModal = async () => {
  openClassifyDrawer.value = true
  await nextTick()
  classifyModalRef.value?.getDossierById()
}
const handleCompareDossier = () => {
  showConfirmModal({
    message:
      'Sau khi nhấn vào nút “Xác nhận”, hệ thống ghi nhận tất cả các loại chứng từ tại thời điểm này đã chỉnh sửa xong và thực hiện Đối sánh</br >Bạn xác nhận đã hoàn thành kiểm tra chứ?',
    title: 'Xác nhận Đã kiểm tra két quả trích xuất',
    onConfirm: (instance, done) => {
      setTimeout(() => {
        done()
        instance.confirmButtonLoading = false
      }, 3000)
    }
  })
}
const handleDeniedDossier = () => {
  showConfirmModal({
    message:
      'Sau khi nhấn vào nút “Xác nhận”, hệ thống ghi nhận việc “Từ chối” bộ chứng từ, kết thúc giao dịch xử lý </br ><div class="mt-4"></div>Lý do từ chối',
    title: 'Xác nhận “Từ chối” bộ chứng từ',
    type: 'prompt',
    options: {
      customClass: 'box-denied-confirm',
      inputPlaceholder: 'Nhập lý do từ chối',
      inputPattern: /.{1,}/,
      inputErrorMessage: 'Vui lòng nhập lý do từ chối!'
    },
    onConfirm: (instance, done) => {
      setTimeout(() => {
        done()
        instance.confirmButtonLoading = false
      }, 3000)
    }
  })
}
onMounted(() => {
  getDossiersList()
})
</script>

<template>
  <div>
    <div class="flex h-screen text-[14px] extract-page overflow-hidden">
      <div class="w-[72%]">
        <div class="flex flex-row h-full">
          <div class="w-[180px]">
            <div class="p-[16px] px-[20px] btn-go-back relative z-[1]">
              <el-button :icon="ArrowLeft" class="text-[#005d98] border-[#005d98]">Trở lại</el-button>
            </div>
            <div class="h-[calc(100vh-126px)] overflow-y-auto">
              <div
                v-for="(item, index_ds) in dossierListData"
                :key="index_ds"
                class="p-3 border-b-[1px] border-b-[#e9ecef] text-[13px] text-[#868e96] hover:bg-[#e7f5ff] cursor-pointer"
                @click="getDossierById(index_ds)"
                :class="{ 'dossier-active bg-[#e7f5ff]': index_ds === idDossierActive }"
              >
                <div>{{ item.name }}</div>
                <div class="mt-2 flex items-center">
                  <span class="w-[8px] h-[8px] bg-[#1098ad] rounded-full mr-[4px]" />
                  <span>{{ item.status }}</span>
                </div>
              </div>
            </div>
            <div class="tab-footer p-[16px] shadow-[inset_0_1px_0_0_#d0d0d0] text-center">
              <el-button class="text-[#1c7ed6] border-[#1c7ed6]" @click="openClassifyModal()">Sửa phân loại</el-button>
            </div>
          </div>
          <div class="overflow-auto w-[100%] bg-[#f1f3f5] px-2">
            <PDFView
              v-if="documentDetail?.file"
              ref="pdfViewRef"
              :url="documentDetail?.file"
              @loaded-data="onLoadedPDF()"
            />
          </div>
        </div>
      </div>
      <div class="w-[28%]">
        <div class="flex justify-between p-4 font-semibold items-center">
          <span>{{ documentDetail?.name }}</span>
          <el-dropdown placement="bottom-end" trigger="click">
            <el-button :icon="More" class="p-[8px]" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <div class="flex gap-[6px] items-center leading-9">
                    <SvgIcon name="ic-reload-document" />
                    Thay thế chứng từ
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="flex gap-[6px] items-center leading-8">
                    <SvgIcon name="ic-ocr" />
                    Trích xuất OCR
                  </div></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-tabs class="tabs-infor" v-model="activeName">
          <el-tab-pane label="Kết quả OCR" name="ocr">
            <div class="h-[calc(100vh-185px)] overflow-y-auto">
              <template v-if="isLoadedPdf">
                <div
                  v-for="(item, index) in documentDetail?.result.data"
                  :key="index"
                  class="mt-[12px] py-[5px] px-[6px] item-dossier cursor-pointer"
                  :class="[renderClassOcr(item.confidence), fieldSelect === item.key ? 'bg-[#e1edfe]' : '']"
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
                  v-for="(item, index) in documentDetail?.result?.data"
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
            <div class="tab-footer p-[16px] flex justify-between shadow-[inset_0_1px_0_0_#d0d0d0]">
              <el-button :icon="CloseBold" class="text-[#c92a2a] border-[#c92a2a]" @click="handleDeniedDossier()"
                >Từ chối</el-button
              >
              <div class="flex gap-[16px]">
                <el-button class="text-[#fff] bg-[#1c7ed6]"><SvgIcon name="ic-save" class="mr-1" />Lưu lại</el-button>
                <el-button :icon="Select" class="text-[#fff] bg-[#099268]" @click="handleCompareDossier()"
                  >Đối sánh</el-button
                >
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Lịch sử chỉnh sửa" name="history">
            <HistoryTab :isActive="activeName === 'history'" />
          </el-tab-pane>
          <el-tab-pane label="Ghi chú" name="note">
            <NoteTab :isActive="activeName === 'note'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <EIBDrawer v-if="openClassifyDrawer" title="Danh sách chứng từ" v-model="openClassifyDrawer" size="93%">
    <template #default> <ClassifyModal ref="classifyModalRef" /> </template>
  </EIBDrawer>
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
.box-denied-confirm .el-message-box__input {
  padding-top: 5px !important;
}
</style>
