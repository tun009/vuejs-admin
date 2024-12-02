<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import {
  comparisonDocumentApi,
  getDossierDetailApi,
  getDossierListApi,
  ocrDocumentApi,
  saveDossierDocApi
} from '@/api/extract'
import { useConfirmModal } from '@/hooks/useConfirm'
import {
  ExtractDocumentModel,
  ExtractDossierModel,
  ExtractResultOcrModel,
  ExtractResultOcrTableChildrenModel,
  ExtractResultOcrTableHeaderModel
} from '@/@types/pages/extract'
import PDFView from './components/PDFView.vue'
import HistoryTab from './components/HistoryTab.vue'
import NoteTab from './components/NoteTab.vue'
import ClassifyModal from './components/ClassifyModal.vue'
import TableStructuredOcr from './components/TableStructuredOcr.vue'

import ReplaceDocumentModal from './components/ReplaceDocumentModal.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { useRoute } from 'vue-router'

import EIBDrawer from '@/components/common/EIBDrawer.vue'
import { renderLabelByValue, formatNumberConfidence, renderColorByValue } from '@/utils/common'
import { documentStatusOptions } from '@/@types/pages/docs/documents'
import { ArrowLeft, More, CloseBold, Select } from '@element-plus/icons-vue'
import { ExtractPostDossierRequestModel } from '@/@types/pages/extract/service/ExtractRequest'
import { ElMessage, ElMessageBox } from 'element-plus'
import { regexNullOrEmpty } from '@/constants/regex'
import router from '@/router'
import { DOCUMENT_DETAIL_PAGE, EXTRACT_PAGE } from '@/constants/router'
import { DocTypeEnum } from '@/@types/pages/rules'
import { updateDocumentStatus } from '@/api/docs/document/compare'
import { DocumentStatusEnum } from '@/@types/common'
const dossierListData = ref<ExtractDossierModel[]>([])
const documentDetail = ref<ExtractDocumentModel>()
const activeName = ref('ocr')
const fieldSelect = ref('')
const pdfViewRef = ref()
const classifyModalRef = ref()
const openClassifyDrawer = ref(false)
const idDossierActive = ref()
const isLoadViewContentRight = ref<boolean>(false)
const loading = ref<boolean>(false)
const isShowModalReplace = ref<boolean>(false)
const resizeTable = ref<number>(100)
const isShowTable = ref<boolean>(false)
const isLoadingOcr = ref<boolean>(false)
const { showConfirmModal } = useConfirmModal()
const route = useRoute()
const baseURL = import.meta.env.VITE_BASE_API
const getDossiersList = async (id: number) => {
  try {
    const response = await getDossierListApi(id)
    dossierListData.value = response?.data?.map((item) => {
      return {
        ...item,
        status: renderLabelByValue(documentStatusOptions, item.status) || 'Đang phân loại',
        color: renderColorByValue(documentStatusOptions, item.status) || '#1098ad'
      }
    })
    // hard code
    if (dossierListData.value.length > 0 && !route?.query?.dossierDocId) getDossierById(dossierListData.value[0]?.id)
  } catch (error: any) {
    throw new Error(error)
  }
}
const getDossierById = (id: number) => {
  idDossierActive.value = id
  router.replace({
    path: EXTRACT_PAGE,
    query: {
      batchId: route.query.batchId,
      dossierDocId: id
    }
  })
  getDossiersDetail(id)
}
const ocrDataDetail = ref<ExtractResultOcrModel[]>([])
const isFirstViewExtract = ref<boolean>(false)
const docTypeOcrData = ref()
const getDossiersDetail = async (id: number) => {
  try {
    resetOptions()
    const response = await getDossierDetailApi(id)
    documentDetail.value = response.data
    ocrDataDetail.value = documentDetail.value.result[0]
    docTypeOcrData.value = documentDetail.value?.docType
    if (docTypeOcrData.value === DocTypeEnum.DRAFT) isFirstViewExtract.value = true
    isLoadViewContentRight.value = true
  } catch (error: any) {
    throw new Error(error)
  }
}
const resetOptions = () => {
  isLoadViewContentRight.value = false
  isShowTable.value = false
  isLoadedPdf.value = false
  activeName.value = 'ocr'
  documentDetail.value = {} as ExtractDocumentModel
}
const headerTable = ref<ExtractResultOcrTableHeaderModel[]>([])
const bodyTable = ref<ExtractResultOcrTableChildrenModel[][]>([])
const handleClickField = (item: ExtractResultOcrModel) => {
  fieldSelect.value = item.coreKey
  if (item.type === 'structured_table' && item?.headers.length > 0) clickTable(item)
  else {
    resizeTable.value = 100
    pdfViewRef.value?.tagLabelToPage(item.bboxes, item.pageId)
    // waiting for close table animation...
    setTimeout(() => {
      isShowTable.value = false
    }, 500)
  }
}
const clickTable = (data: ExtractResultOcrModel) => {
  isShowTable.value = true
  // pdfViewRef.value?.goToPageView(data.pageId)
  resizeTable.value = 70
  if (!data?.childrenMapping) bodyTable.value = mappingBodyTable(data.headers, data.children)
  headerTable.value = data.headers
  // bodyTable.value = data.childrenMapping
}
const mappingBodyTable = (header: ExtractResultOcrTableHeaderModel[], body: ExtractResultOcrTableChildrenModel[][]) => {
  const bodyConvert: ExtractResultOcrTableChildrenModel[][] = []
  body.forEach((rowBody) => {
    const result: ExtractResultOcrTableChildrenModel[] = []
    header.forEach((headerItem) => {
      const matchedItem = rowBody.find((bodyItem) => bodyItem.coreKey === headerItem.key)

      if (matchedItem) {
        result.push(matchedItem)
      }
    })
    bodyConvert.push(result)
  })
  return bodyConvert
}
const renderClassOcr = (conf: number = 0) => {
  return conf > 0.75 ? 'trust-hight' : 'trust-medium'
}
const renderColorOcr = (cd: number = 0) => {
  if (cd === 0 || cd === undefined) return '#7a8da5'
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
  classifyModalRef.value?.openModalClassify()
}
const closeDialogClassify = () => {
  openClassifyDrawer.value = false
}
const handleCompareDossier = () => {
  showConfirmModal({
    message:
      'Sau khi nhấn vào nút “Xác nhận”, hệ thống ghi nhận tất cả các loại chứng từ tại thời điểm này đã chỉnh sửa xong và thực hiện Đối sánh</br >Bạn xác nhận đã hoàn thành kiểm tra chứ?',
    title: 'Xác nhận Đã kiểm tra két quả trích xuất',
    showMesageSucess: false,
    onConfirm: async (instance, done) => {
      try {
        await comparisonDocumentApi(Number(route?.query?.batchId))
        ElMessage({
          showClose: true,
          type: 'success',
          message: 'Xác nhận đối sánh bộ chứng từ thành công'
        })
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    }
  })
}
const handleDeniedDossier = () => {
  ElMessageBox.prompt(
    'Sau khi nhấn vào nút “Xác nhận”, hệ thống ghi nhận việc “Từ chối” bộ chứng từ, kết thúc giao dịch xử lý </br ><div class="mt-4"></div>Lý do từ chối',
    'Xác nhận “Từ chối” bộ chứng từ',
    {
      confirmButtonText: 'Xác nhận',
      customClass: 'box-denied-confirm',
      inputPlaceholder: 'Nhập lý do từ chối',
      cancelButtonText: 'Đóng',
      inputPattern: regexNullOrEmpty,
      dangerouslyUseHTMLString: true,
      draggable: true,
      inputErrorMessage: 'Vui lòng nhập lý do từ chối!'
    }
  ).then(async ({ value }) => {
    await updateDocumentStatus(route?.query?.batchId as string, {
      approveDossier: DocumentStatusEnum.DENIED,
      message: value
    })
    ElMessage({
      type: 'success',
      message: `Đã từ chối bộ chứng từ thành công!`
    })
    goToBackDocumentPage()
  })
}
const viewFirstExtract = () => {
  isFirstViewExtract.value = true
  ocrDataDetail.value = documentDetail.value!.result[0]
  resetFieldActive()
}
const viewSecondExtract = () => {
  isFirstViewExtract.value = false
  ocrDataDetail.value = documentDetail.value!.result[1]
  resetFieldActive()
}
const resetFieldActive = () => {
  fieldSelect.value = ''
  const listActivesRemove = document.querySelectorAll('.box-label')
  listActivesRemove.forEach((element) => {
    element.remove()
  })
}
const saveDossier = async () => {
  try {
    loading.value = true
    const dataUpdate = [] as ExtractPostDossierRequestModel[]
    documentDetail.value!.result.forEach((doc) => {
      doc.forEach((item) => {
        if (item.type === 'structured_table' && item?.children?.length > 0) {
          item?.children?.forEach((row) => {
            row.forEach((child) => {
              dataUpdate.push({ docDataId: child.id, value: child?.validatedValue ?? '' })
            })
          })
        } else dataUpdate.push({ docDataId: item.id, value: item?.validatedValue ?? '' })
      })
    })
    const response = await saveDossierDocApi(Number(route?.query?.dossierDocId), dataUpdate)
    if (response.data) {
      ElMessage({
        showClose: true,
        type: 'success',
        message: 'Cập nhật thành công'
      })
      closeTable()
      // getDossiersDetail(idDossierActive.value)
      loading.value = false
    }
  } catch (error: any) {
    throw new Error(error)
  } finally {
    loading.value = false
  }
}
const closeTable = () => {
  resizeTable.value = 100
}
const openModalReplaceDocument = () => {
  isShowModalReplace.value = true
}
const goToBackDocumentPage = () => {
  router.push(DOCUMENT_DETAIL_PAGE(route?.query?.batchId as string))
}
const handleOcrDoc = async () => {
  try {
    isLoadedPdf.value = false
    isLoadingOcr.value = true
    const response = await ocrDocumentApi(Number(route?.query?.dossierDocId))
    if (response.data)
      ElMessage({
        showClose: true,
        type: 'success',
        message: 'Trích xuất OCR thành công'
      })
    isLoadedPdf.value = true
    isLoadingOcr.value = false
  } catch (error: any) {
    throw new Error(error)
  }
}
onMounted(() => {
  getDossiersList(Number(route?.query?.batchId))
  if (route?.query?.dossierDocId) getDossierById(Number(route?.query?.dossierDocId))
})
</script>

<template>
  <div>
    <div class="flex h-screen text-[14px] extract-page overflow-hidden">
      <div class="w-[72%]">
        <div class="flex flex-row h-full">
          <div class="w-[180px]">
            <div class="p-[16px] px-[20px] btn-go-back relative z-[1]">
              <el-button :icon="ArrowLeft" class="text-[#005d98] border-[#005d98]" @click="goToBackDocumentPage()"
                >Trở lại</el-button
              >
            </div>
            <div class="h-[calc(100vh-126px)] overflow-y-auto">
              <div
                v-for="(item, index_ds) in dossierListData"
                :key="index_ds"
                class="p-3 border-b-[1px] border-b-[#e9ecef] text-[13px] text-[#868e96] hover:bg-[#e7f5ff] cursor-pointer"
                @click="getDossierById(item.id)"
                :class="{ 'dossier-active bg-[#e7f5ff]': item.id === idDossierActive }"
              >
                <div>{{ item?.docType?.name }}</div>
                <div class="mt-2 flex items-center">
                  <span class="w-[8px] h-[8px] rounded-full mr-[4px]" :style="{ backgroundColor: item?.color?.text }" />
                  <span>{{ item.status }}</span>
                </div>
              </div>
            </div>
            <div class="tab-footer p-[16px] shadow-[inset_0_1px_0_0_#d0d0d0] text-center" v-if="isLoadViewContentRight">
              <el-button class="text-[#1c7ed6] border-[#1c7ed6]" @click="openClassifyModal()">Sửa phân loại</el-button>
            </div>
          </div>
          <div class="overflow-auto w-[100%] bg-[#f1f3f5] px-2">
            <splitpanes class="default-theme h-full" horizontal>
              <pane :size="resizeTable">
                <PDFView
                  v-if="documentDetail?.pathFile"
                  ref="pdfViewRef"
                  :url="`${baseURL}/files?src=${documentDetail?.pathFile}`"
                  :isLoadingOcr="isLoadingOcr"
                  @loaded-data="onLoadedPDF()"
                />
              </pane>
              <pane v-if="isShowTable" :size="100 - resizeTable" class="!bg-[#fff]">
                <div class="text-right">
                  <el-icon class="cursor-pointer mr-[5px]" @click="closeTable"><CloseBold /></el-icon>
                </div>
                <div class="h-[93%] overflow-auto">
                  <TableStructuredOcr :header="headerTable" :body="bodyTable" :pdfViewRef="pdfViewRef" />
                </div>
              </pane>
            </splitpanes>
          </div>
        </div>
      </div>
      <div class="w-[28%]">
        <div v-if="isLoadViewContentRight">
          <div class="flex justify-between p-4 font-semibold items-center">
            <span>{{ documentDetail?.fileName }}</span>
            <el-dropdown placement="bottom-end" trigger="click">
              <el-button :icon="More" class="p-[8px]" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div class="flex gap-[6px] items-center leading-9" @click="openModalReplaceDocument()">
                      <SvgIcon name="ic-reload-document" />
                      Thay thế chứng từ
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div class="flex gap-[6px] items-center leading-8" @click="handleOcrDoc()">
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
              <div v-if="docTypeOcrData === DocTypeEnum.DRAFT" class="flex gap-[15px] justify-center">
                <el-button
                  class="rounded-[20px]"
                  :class="{ ' bg-[#1c7ed6] text-[#fff] ': isFirstViewExtract }"
                  @click="viewFirstExtract()"
                  >First</el-button
                >
                <el-button
                  class="rounded-[20px]"
                  :class="{ ' bg-[#1c7ed6] text-[#fff] ': !isFirstViewExtract }"
                  @click="viewSecondExtract()"
                  >Second</el-button
                >
              </div>
              <div
                class="overflow-y-auto"
                :class="docTypeOcrData === DocTypeEnum.DRAFT ? 'h-[calc(100vh-207px)]' : 'h-[calc(100vh-185px)] '"
              >
                <template v-if="isLoadedPdf">
                  <div
                    v-for="(item, index) in ocrDataDetail"
                    :key="index"
                    class="mt-[12px] py-[5px] px-[6px] item-dossier cursor-pointer"
                    :class="[renderClassOcr(item?.confidence), fieldSelect === item.coreKey ? 'bg-[#e1edfe]' : '']"
                    @click="handleClickField(item)"
                  >
                    <div class="mx-[16px] border-l-[2px] border-solid">
                      <div class="ml-[16px]">
                        <div class="flex">
                          <span
                            class="text-[#fff] rounded-[3px] px-[4px] text-[12px] py-[2px] font-medium max-h-6"
                            :style="{
                              backgroundColor: renderColorOcr((item.confidence ?? 0) * 100)
                            }"
                          >
                            {{ formatNumberConfidence(item?.confidence ?? 0) }}%
                          </span>
                          <span class="ml-2 text-[#adb5bd] break-words text-break">{{ item.name }}</span>
                        </div>
                        <div class="mt-[8px] min-h-[12px]">
                          <div v-if="item.type === 'structured_table'">Click để xem</div>
                          <el-input
                            v-else-if="fieldSelect === item.coreKey && item.type !== 'image'"
                            v-model="item.validatedValue"
                            autosize
                            type="textarea"
                          />
                          <div v-else-if="item.type === 'image'">
                            <img
                              v-if="item?.validatedValue"
                              :src="'data:image/png;base64,' + item.validatedValue"
                              alt=""
                              class="h-[70px]"
                            />
                          </div>
                          <div v-else>{{ item.validatedValue }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="ocrDataDetail.length > 0">
                  <div
                    v-for="(item, index) in ocrDataDetail"
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
                          <span class="ml-2 text-[#adb5bd]">{{ item.coreKey }}</span>
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
                <div class="flex">
                  <el-button class="text-[#fff] bg-[#1c7ed6]" @click="saveDossier()" :loading="loading"
                    ><SvgIcon name="ic-save" class="mr-1" />Lưu lại</el-button
                  >
                  <el-button :icon="Select" class="text-[#fff] bg-[#099268]" @click="handleCompareDossier()"
                    >Đối sánh</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Lịch sử chỉnh sửa" name="history">
              <HistoryTab :isActive="activeName === 'history'" :dossierDocId="Number(route?.query?.dossierDocId)" />
            </el-tab-pane>
            <el-tab-pane label="Ghi chú" name="note">
              <NoteTab :isActive="activeName === 'note'" :batchId="Number(route?.query?.batchId)" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
  <EIBDrawer v-if="openClassifyDrawer" title="Danh sách chứng từ" v-model="openClassifyDrawer" size="93%">
    <template #default> <ClassifyModal ref="classifyModalRef" @close-dialog="closeDialogClassify()" /> </template>
  </EIBDrawer>
  <ReplaceDocumentModal
    v-if="isShowModalReplace"
    v-model="isShowModalReplace"
    :dossierDocId="Number(route?.query?.dossierDocId)"
  />
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
.text-break {
  word-break: break-word;
}
</style>
