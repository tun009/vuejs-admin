<script lang="ts" setup>
import { documentTypeOptions } from '@/@types/pages/docs/documents'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { documentCompareResultConfigs, documentCompareResults } from '@/mocks/document'
import { scrollIntoViewParent } from '@/utils/common'
import { ArrowLeft, Check, CircleCheckFilled, Close, WarnTriangleFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CompareRejectForm from './components/CompareRejectForm.vue'
import DocumentCompareResult from './components/DocumentCompareResult.vue'
import ResizableSplitter from './components/ResizableSplitter.vue'

const router = useRouter()
const route = useRoute()
const { startLoading, stopLoading } = useLoading()
const { showConfirmModal } = useConfirmModal()

const { t } = useI18n()
const documentType = ref<number>(0)
const conditionSelect = ref<number>(0)
const activeName = ref<'result' | 'history'>('result')
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const compareRejectFormRef = ref<InstanceType<typeof CompareRejectForm>>()

const handleCheckCompareResult = (index: number) => {
  try {
    conditionSelect.value = index
    const id = `document-compare-${index}`
    scrollIntoViewParent(id)
  } catch (error) {
    console.error(error)
  }
}

const handleBack = () => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
    .then(() => {
      router.push(DOCUMENT_DETAIL_PAGE(route.params?.id as string))
    })
    .catch(() => {
      // catch error
    })
}

const handleConfirmCompare = () => {
  showConfirmModal({
    title: 'Xác nhận kết quả kiểm tra bộ chứng từ',
    message:
      'Sau khi nhấn vào nút “Xác nhận”, hệ thống ghi nhận việc kiểm tra kết quả đã hoàn tất, chuyển sang trạng thái “Đã kiểm tra”</br ></br />Bạn xác nhận hoàn thành kiểm tra chứ?',
    successCallback: () => {
      router.push(DOCUMENT_DETAIL_PAGE(route.params?.id as string))
    },
    onConfirm: (instance, done) => {
      setTimeout(() => {
        done()
        instance.confirmButtonLoading = false
      }, 3000)
    }
  })
}

const compareResults = computed(() => {
  return documentCompareResults[documentType.value]
})

const compareResultsConfigs = computed(() => {
  return documentCompareResultConfigs[documentType.value]
})

const documentTypeLabel = computed(() => {
  return documentTypeOptions.find((i) => i.value === documentType.value)?.label
})

const isValid = computed(() => {
  return compareResults.value.every((i) => i.status === 'valid')
})

watch(
  () => documentType.value,
  () => {
    startLoading()
    setTimeout(() => {
      stopLoading()
    }, 500)
  }
)
</script>

<template>
  <EIBDialog
    title="Xác nhận “Từ chối” bộ chứng từ"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    @on-confirm="compareRejectFormRef?.onConfirm"
  >
    <CompareRejectForm
      ref="compareRejectFormRef"
      @update:loading="(loading: boolean) => (loadingConfirm = loading)"
      @update:visible="(visible: boolean) => (dialogVisible = visible)"
    />
  </EIBDialog>

  <div
    class="flex flex-row justify-between py-2 px-4 border border-[#ced4da] fixed top-0 left-0 w-full bg-white dark:bg-[#141414] z-[10]"
  >
    <el-button color="#005d98" plain :icon="ArrowLeft" @click="handleBack">Trở lại</el-button>
    <el-text class="text-[24px]">Kiểm tra chứng từ {{ documentTypeLabel }}</el-text>
    <div class="flex flex-row gap-3">
      <el-button type="danger" :icon="Close" @click="dialogVisible = true">Từ chối</el-button>
      <el-button type="success" :icon="Check" @click="handleConfirmCompare">Xác nhận</el-button>
    </div>
  </div>
  <div class="pt-20">
    <div class="border border-t-[#e9ecef]">
      <ResizableSplitter custom-class="h-[calc(100vh_-_90px)]" :default-left-width="400">
        <template #left>
          <div class="flex flex-col">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <span class="c-text-value">Tên bộ chứng từ</span>
                <span class="text-base">KIEMGOC.2024.00133</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="c-text-value">Ngày upload chứng từ</span>
                <span class="text-base">12-09-2024 15:22</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="c-text-value">Tổng trị giá</span>
                <span class="text-base">110,000 USD</span>
              </div>
            </div>
            <el-divider />
            <EIBSelect v-model="documentType" :options="documentTypeOptions" label="Chứng từ đang kiểm tra" />
            <div class="flex-1 flex flex-col gap-3">
              <span>Kết quả kiểm tra</span>
              <div
                v-if="isValid"
                class="rounded-md px-3 py-2 bg-[#e6fcf5] flex flex-row gap-2 items-center w-fit text-[#099268]"
              >
                <el-icon size="20"><CircleCheckFilled /></el-icon>
                <span class="text-base">Hợp lệ</span>
              </div>
              <div
                v-else
                class="rounded-md px-3 py-2 bg-[#fff4e6] flex flex-row gap-2 items-center w-fit text-[#d9480f]"
              >
                <el-icon size="20"><WarnTriangleFilled /></el-icon>
                <span class="text-base">Bất hợp lệ</span>
              </div>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <span>Danh sách kiểm tra</span>
              <div class="flex flex-col gap-1">
                <div
                  v-for="(step, index) in compareResults"
                  :key="index"
                  class="flex flex-row gap-2 items-start cursor-pointer"
                  @click="() => handleCheckCompareResult(index)"
                >
                  <el-icon class="mt-1" size="18">
                    <CircleCheckFilled class="text-[#099268]" v-if="step.status === 'valid'" />
                    <WarnTriangleFilled class="text-[#e03131]" v-if="step.status === 'invalid'" />
                    <CircleCheckFilled class="text-[#d8d8d8]" v-if="step.status === 'inprogress'" />
                  </el-icon>
                  <span class="c-text-primary">{{ index + 1 }}. {{ step.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Kết quả" name="result">
              <DocumentCompareResult
                :configs="compareResultsConfigs"
                :condition-select="conditionSelect"
                @update:condition="(condition: number) => (conditionSelect = condition)"
              />
            </el-tab-pane>
            <el-tab-pane label="Lịch sử chỉnh sửa" name="history">Lịch sử chỉnh sửa</el-tab-pane>
          </el-tabs>
        </template>
      </ResizableSplitter>
    </div>
  </div>
</template>
