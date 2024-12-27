<script lang="ts" setup>
import ReplaceDocumentErrorModal from './ReplaceDocumentErrorModal.vue'
import ControlSlider from '@/views/extract/components/ControlSlider.vue'
import { getDocummentTypeApi } from '@/api/extract'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { Delete, Plus } from '@element-plus/icons-vue'

import { computed, ref } from 'vue'
import { SelectOptionModel } from '@/@types/common'
import { ElMessage } from 'element-plus'
import { useConfirmModal } from '@/hooks/useConfirm'
import { getDocumentClassifyErrorApi, postReplaceDocumentError } from '@/api/docs/document'
import { DocumentClassifyErrordModel, ReplaceDocumentClassifyErrordModel } from '@/@types/pages/docs/documents'
import { UpdateDosssierReplaceRequestModel } from '@/@types/pages/docs/documents/services/DocumentRequest'
const { showConfirmModal } = useConfirmModal()

const dataDetail = ref<DocumentClassifyErrordModel[]>([])
const documentTypes = ref<SelectOptionModel[]>([])
const pageActive = ref<string>()
const baseURL = import.meta.env.VITE_BASE_API
const idFullScreen = 'image-container'
const scale = ref(0.7)
interface Props {
  batchId: number | string
  errorMessage?: string
}
interface Emits {
  (e: 'close-dialog'): void
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const isShowModalReplace = ref<boolean>(false)

const loading = ref<boolean>(false)
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
    const { data } = await getDocumentClassifyErrorApi(props.batchId)
    dataDetail.value = data.map((item) => ({
      ...item,
      pageList: item.pages.split(',').map((page) => Number(page))
    }))
    // const { pdf } = usePDF(`${baseURL}/files?src=${response.data[0].filePath}`)
    // pdfExtract = pdf
    if (dataDetail.value.length > 0) handleCollapseChange(dataDetail.value[0])
  } catch (error: any) {
    throw new Error(error)
  }
}
const listMessageErrors = computed(() => {
  return (props?.errorMessage ?? '').split('\n')
})
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
const docIndexActive = ref<number>(1)
const handleCollapseChange = (value: DocumentClassifyErrordModel, isReplace?: boolean) => {
  if (isReplace && value.pageList.length === 0) value.pageList = [0]
  const { pdf, pages } = usePDF(`${baseURL}/files?src=${value?.pathFile}`)
  if (!value?.pdfEtract) value.pdfEtract = pdf
  if (value?.pageList?.length > 0) {
    const intervalId = setInterval(() => {
      if (value?.isLoaded === true) {
        if (isReplace) value.pageList = Array.from({ length: pages.value }, (_, index) => index)
        viewPage('doc' + value.dossierFileId + 'page' + value?.pageList[0])
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
const saveDossierClassify = async () => {
  try {
    loading.value = true
    const dataPost = dataDetail.value
      .filter((doc) => doc.pageList.length > 0)
      .map((item) => ({
        dossierDocId: item?.id,
        docType: item.docType.key,
        fileId: item?.fileId,
        dossierFileId: item?.dossierFileId
      })) as UpdateDosssierReplaceRequestModel[]
    await postReplaceDocumentError(dataPost, props.batchId)
    ElMessage({
      showClose: true,
      type: 'success',
      message: 'Cập nhật thành công'
    })
    loading.value = false
    emits('close-dialog')
    emits('refresh')
  } catch (error: any) {
    throw new Error(error)
  }
}
const handleDeleteDoc = (data: DocumentClassifyErrordModel[], index: number) => {
  showConfirmModal({
    message: `Chứng từ sau khi xóa sẽ bị chuyển sang mục Khác. Bạn chắc chắn muốn xóa chứng từ này?`,
    title: 'Xác nhận Xóa chứng từ',
    showMesageSucess: false,
    onConfirm: (_, done) => {
      const docCopy = { ...data[index] }
      docCopy.docType = {
        id: 159,
        name: 'Khác',
        key: 'OTHER',
        type: 'extraction'
      }
      docCopy.isReplace = true
      data.splice(index, 1)
      data.push(docCopy)
      done()
    }
  })
}
const increaseDocument = (data: DocumentClassifyErrordModel[]) => {
  data.push({
    name: '',
    docType: {
      id: 159,
      name: 'Khác',
      key: 'OTHER',
      type: 'extraction'
    },
    dossierFileId: null,
    pathFile: '',
    pages: '',
    pageList: []
  })
  docIndexActive.value = data.length
}
const openModalReplaceDocument = () => {
  isShowModalReplace.value = true
}
const handleFileReplace = (data: ReplaceDocumentClassifyErrordModel) => {
  const doc = dataDetail.value?.[docIndexActive.value - 1]
  if (doc) {
    const docCopy = { ...doc }
    Object.assign(doc, {
      id: undefined,
      pathFile: data.pathFile,
      pdfEtract: null,
      isLoaded: false,
      isReplace: true,
      fileId: data.fileId,
      dossierFileId: data.dossierFileId,
      countNumReplace: (doc.countNumReplace || 0) + 1
    })
    // Nếu số lần thay thế < 2, push doc coppy vào others
    if (doc?.pageList?.length > 0 && (doc.countNumReplace || 0) < 2) {
      docCopy.docType = {
        id: 159,
        name: 'Khác',
        key: 'OTHER',
        type: 'extraction'
      }
      dataDetail.value.push(docCopy)
    }
    handleCollapseChange(doc, true)
  }
}
</script>
<template>
  <div class="h-[92vh] mx-[-20px] mb-[-4rem] classify-modal" v-loading="loading">
    <div class="w-full flex h-[94%]">
      <div class="flex w-full">
        <div class="w-[35%] border border-gray-300 border-solid">
          <div v-if="dataDetail.length > 0" class="h-[100%] overflow-auto">
            <div class="demo-collapse">
              <div
                v-for="(doc_result, index_result) in dataDetail"
                :key="index_result"
                class="custom-collapse justify-content-xl-between d-flex"
              >
                <el-collapse
                  class="child-collapse custom-collapse"
                  v-model="docIndexActive"
                  @change="handleCollapseChange(doc_result)"
                  accordion
                >
                  <el-collapse-item :name="index_result + 1">
                    <template v-slot:title>
                      <EIBSelect
                        @click.stop
                        v-model="doc_result.docType.key"
                        name="bizType"
                        :options="documentTypes"
                        :readonly="doc_result.isReplace"
                        hiddenError
                      />
                      <el-button
                        :icon="Delete"
                        class="p-[8px] border-[#c92a2a] text-[#c92a2a]"
                        @click.stop="handleDeleteDoc(dataDetail, index_result)"
                      />
                    </template>
                    <div
                      class="ml-[10px]"
                      v-for="(doc_page, index_doc_page) in doc_result.pageList"
                      :key="index_doc_page"
                    >
                      <VuePDF
                        :pdf="doc_result.pdfEtract"
                        :page="doc_page + 1"
                        :width="2000"
                        class="page-extract mt-[5px] mx-auto w-[100px] cursor-pointer"
                        :style="
                          pageActive === `doc${doc_result.dossierFileId}page${doc_page}`
                            ? 'border: solid 2px #1864ab'
                            : ''
                        "
                        :id="`doc${doc_result.dossierFileId}page${doc_page}`"
                        @loaded="doc_result.isLoaded = true"
                        @click="viewPage('doc' + doc_result.dossierFileId + 'page' + doc_page)"
                      />
                      <div class="text-center mt-[5px]">Trang {{ doc_page + 1 }}</div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div class="text-center">
                <el-button
                  v-if="dataDetail?.length > 0"
                  @click="increaseDocument(dataDetail)"
                  :icon="Plus"
                  class="my-[16px] py-[16px] px-[24px] border-dashed border-[#495057] text-[#495057] mx-auto rounded-[4px]"
                />
              </div>
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
      <div class="w-[350px] p-[16px] border-t border-b border-gray-300 border-solid">
        <div class="bg-[#fff4e6] rounded-[4px] p-[12px] border border-[#f76707] border-solid border-1">
          <div class="flex"><SvgIcon name="warning" class="mr-1" /><span> Hệ thống phát hiện</span></div>
          <ul class="list-disc ml-[20px]">
            <li v-for="(item, index) in listMessageErrors" :key="index">{{ item }}</li>
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
          :disabled="!docIndexActive"
          class="mr-[20px] border-[#005d98] text-[#005d98] mt-[16px]"
          type="default"
          @click="openModalReplaceDocument()"
          ><SvgIcon v-if="!docIndexActive" name="ic-reload-document" class="mx-1" />
          <SvgIcon v-else name="ic-reload-documents" class="mx-1" />
          Thay thế chứng từ</el-button
        >
      </div>
    </div>
    <div class="flex justify-end items-center h-[6%]">
      <el-button type="default" @click="emits('close-dialog')">Hủy</el-button>
      <el-button class="mr-[20px]" type="primary" @click="saveDossierClassify()"
        ><SvgIcon name="ic-save" class="mr-1" />Lưu lại</el-button
      >
    </div>
  </div>
  <ReplaceDocumentErrorModal
    v-if="isShowModalReplace"
    title="Thay thế chứng từ"
    v-model="isShowModalReplace"
    :dossierDocId="Number(docIndexActive)"
    :batchId="props.batchId"
    @update-file-replace="handleFileReplace"
  />
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
