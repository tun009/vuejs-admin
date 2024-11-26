<script lang="ts" setup>
import { ExtractClassifyModel, ExtractClassifyResultModel } from '@/@types/pages/extract'
import { getDossierClassifyApi, getDocummentTypeApi, saveDossierClassifyApi } from '@/api/extract'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import ControlSlider from './ControlSlider.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { formatNumberConfidence } from '@/utils/common'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { Delete, Plus } from '@element-plus/icons-vue'

import { ref } from 'vue'
import { SelectOptionModel } from '@/@types/common'
import { ElMessage } from 'element-plus'
import { ExtractPostClassifyRequestModel } from '@/@types/pages/extract/service/ExtractRequest'
import { useRoute } from 'vue-router'
import { useConfirmModal } from '@/hooks/useConfirm'
const { showConfirmModal } = useConfirmModal()

const dataDetail = ref<ExtractClassifyModel[]>([])
const documentTypes = ref<SelectOptionModel[]>([])
const pageActive = ref<string>()
const baseURL = import.meta.env.VITE_BASE_API
const idFullScreen = 'image-container'
const scale = ref(0.7)
const route = useRoute()
interface Props {
  showContentRight?: boolean
}
interface Emits {
  (e: 'close-dialog'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const loading = ref<boolean>(false)
const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
}
const getDocumentType = async () => {
  try {
    const response = await getDocummentTypeApi()
    documentTypes.value = response.data.map((item) => ({
      label: item.name,
      value: item.key ?? item.id
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}
const getDossierById = async () => {
  try {
    const response = await getDossierClassifyApi(Number(route?.query?.batchId))
    // response.data = [
    //   {
    //     id: 5215,
    //     fileName: 'Inv 1012ADVEIB220015.pdf',
    //     filePath: '2024-11-08/3361/5211.pdf',
    //     status: 'CLASSIFIED',
    //     createdAt: '2024-11-08T13:05:54.840641Z',
    //     createdBy: 'phuctv14',
    //     pdfEtract: '',
    //     ocrResults: [
    //       {
    //         documentType: 'INVOICE',
    //         confidence: 1,
    //         pages: [0, 1]
    //       },
    //       {
    //         documentType: 'INVOICE',
    //         confidence: 1,
    //         pages: [2, 3]
    //       }
    //     ]
    //   }
    // ]
    dataDetail.value = response.data
    // const { pdf } = usePDF(`${baseURL}/files?src=${response.data[0].filePath}`)
    // pdfExtract = pdf
    if (dataDetail.value.length > 0) handleCollapseChange(dataDetail.value[0])
  } catch (error: any) {
    throw new Error(error)
  }
}
const openModalClassify = () => {
  getDocumentType()
  getDossierById()
}
interface ExtractPdfViewExpose {
  openModalClassify: () => void
}
defineExpose<ExtractPdfViewExpose>({
  openModalClassify
})
const activeNames = ref(0)
const activeNamesChild = ref([0])
const handleCollapseChange = (value: ExtractClassifyModel) => {
  const { pdf } = usePDF(`${baseURL}/files?src=${value?.filePath}`)
  if (!value?.pdfEtract) value.pdfEtract = pdf
  activeNamesChild.value = [0]
  if (value?.ocrResults?.length > 0 && value?.ocrResults[0]?.pages?.length > 0) {
    const intervalId = setInterval(() => {
      if (value?.ocrResults[0].isLoaded === true) {
        viewPage('doc' + value.id + 'page' + value?.ocrResults[0].pages[0])
        clearInterval(intervalId)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(intervalId)
    }, 5000)
  }
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
const validateDossier = async (id: number, result: ExtractClassifyResultModel[]) => {
  const resultConvertData = result
    .filter((item) => item?.documentType)
    .map(
      (item) =>
        ({
          documentType: item.documentType,
          pages: item.pages
        }) as ExtractPostClassifyRequestModel
    )
  await saveDossierClassifyApi(id, resultConvertData)
}
const saveDossierClassify = async () => {
  try {
    loading.value = true
    const validatePromises = [...dataDetail.value]
      .filter((doc) => doc?.ocrResults?.length > 0)
      .map((doc) => validateDossier(doc.id, doc.ocrResults))
    await Promise.all(validatePromises)
    ElMessage({
      showClose: true,
      type: 'success',
      message: 'Cập nhật thành công'
    })
  } catch {
    ElMessage({
      showClose: true,
      type: 'error',
      message: 'Có lỗi xảy ra'
    })
  } finally {
    loading.value = false
  }
}
const handleDeleteDoc = (data: ExtractClassifyResultModel[], index: number) => {
  showConfirmModal({
    message: `Bạn chắc chắn muốn xóa?`,
    title: 'Xác nhận',
    showMesageSucess: false,
    onConfirm: (_, done) => {
      data.splice(index, 1)
      done()
    }
  })
}
const increaseDocument = (data: ExtractClassifyResultModel[]) => {
  activeNamesChild.value.push(data.length)
  data.push({ confidence: 1, documentType: '', pages: [] })
}
const handleDragEnd = (event: any, doc: ExtractClassifyModel) => {
  const fromElement = event?.from as HTMLElement
  const toElement = event?.to as HTMLElement
  if (fromElement?.id !== toElement?.id) {
    const { pdf } = usePDF(`${baseURL}/files?src=${doc.filePath}`)
    doc.pdfEtract = pdf
  }
}
</script>
<template>
  <div class="h-[91vh] mx-[-2rem] mb-[-4rem] classify-modal">
    <div class="w-full flex h-[94%]">
      <div class="flex w-full">
        <div class="w-[35%] border border-gray-300 border-solid">
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
                      <el-collapse-item :name="index_result">
                        <template v-slot:title>
                          <span class="p-[6px] text-sm text-[#fff] bg-[#099268] rounded-[3px]">
                            {{ formatNumberConfidence(doc_result?.confidence ?? 0) }}%</span
                          >
                          <EIBSelect
                            @click.stop
                            v-model="doc_result.documentType"
                            name="bizType"
                            :options="documentTypes"
                            hiddenError
                          />
                          <el-button
                            :icon="Delete"
                            class="p-[8px] border-[#c92a2a] text-[#c92a2a]"
                            @click.stop="handleDeleteDoc(doc.ocrResults, index_result)"
                          />
                        </template>
                        <VueDraggableNext
                          :id="`group${index_result}`"
                          v-bind="dragOptions"
                          v-model="doc_result.pages"
                          group="people"
                          @end="
                            (event) => {
                              handleDragEnd(event, doc)
                            }
                          "
                        >
                          <div
                            class="ml-[10px]"
                            v-for="(doc_page, index_doc_page) in doc_result.pages"
                            :key="index_doc_page"
                          >
                            <VuePDF
                              :pdf="doc.pdfEtract"
                              :page="doc_page + 1"
                              :width="2000"
                              class="page-extract mt-[5px] mx-auto w-[100px] cursor-pointer"
                              :style="pageActive === `doc${doc.id}page${doc_page}` ? 'border: solid 2px #1864ab' : ''"
                              :id="`doc${doc.id}page${doc_page}`"
                              @loaded="doc_result.isLoaded = true"
                              @click="viewPage('doc' + doc.id + 'page' + doc_page)"
                            />
                            <div class="text-center mt-[5px]">Trang {{ doc_page + 1 }}</div>
                          </div>
                        </VueDraggableNext>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                  <div class="text-center">
                    <el-button
                      v-if="doc?.ocrResults?.length > 0"
                      :icon="Plus"
                      class="py-[16px] px-[24px] border-dashed border-[#495057] text-[#495057] mx-auto mt-[10px] rounded-[4px]"
                      @click="increaseDocument(doc?.ocrResults)"
                    />
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
        <div class="w-[65%] image-container border border-gray-300 border-solid">
          <div class="h-[100%] overflow-auto">
            <ControlSlider
              :scale="scale"
              :id-full-screen="idFullScreen"
              class="sticky top-[5px] left-[5px]"
              @update:scale="
                (val: number) => {
                  scale = val
                }
              "
            />
            <div :style="{ width: scale * 100 + '%' }" class="mx-auto mt-[10px]">
              <img v-if="base64Image" :src="base64Image" alt="" loading="lazy" :id="idFullScreen" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="props.showContentRight" class="w-[300px] p-[16px] border-t border-b border-gray-300 border-solid">
        <div class="bg-[#fff4e6] rounded-[4px] p-[12px] border border-[#f76707] border-solid border-1">
          <div class="flex"><SvgIcon name="warning" class="mr-1" /><span> Hệ thống phát hiện</span></div>
          <ul class="list-disc ml-[20px]">
            <li>Có 2 bản Invoice</li>
            <li>Có 2 bản giấy XTCT</li>
          </ul>
        </div>
        <div class="font-bold mt-[16px]">Hướng dẫn:</div>
        <ul class="list-disc ml-[20px] text-[#495057]">
          <li>
            Để thay thế chứng từ hiện tại bằng chứng từ khác, vui lòng bấm nút Thay thế chứng từ và chọn file cần thay
            thế.
          </li>
          <li>
            Để loại bỏ 1 chứng từ bị trùng nhau hoặc không xử lý, bấm vào nút
            <SvgIcon name="delete-mini" class="inline" /> nằm ở kế bên Loại chứng từ bên cột Danh sách.
          </li>
          <li>Để có thể tìm lại chứng từ đã xóa, vui lòng truy cập mục Others.</li>
        </ul>
        <el-button
          class="mr-[20px] border-[#005d98] text-[#005d98] mt-[16px]"
          type="default"
          @click="saveDossierClassify()"
          ><SvgIcon name="ic-reload-documents" class="ml-1" />Thay thế chứng từ</el-button
        >
      </div>
    </div>
    <div class="flex justify-end items-center h-[6%]">
      <el-button type="default" @click="emits('close-dialog')">Hủy</el-button>
      <el-button class="mr-[20px]" type="primary" @click="saveDossierClassify()" :loading="loading"
        ><SvgIcon name="ic-save" class="mr-1" />Lưu lại</el-button
      >
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
  .el-collapse-item__wrap,
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
  .child-collapse .el-collapse-item__header {
    column-gap: 10px;
    padding-right: 5px;
  }
  .el-select--large .el-select__wrapper {
    min-height: 34px;
  }
}
</style>
