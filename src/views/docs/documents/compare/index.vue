<script lang="ts" setup>
import {
  DocumentCompareModel,
  DocumentDataLCModel,
  DocumentKeyModel,
  DocumentLCAmountModel,
  DocumentResultEnum,
  documentTypeOptions
} from '@/@types/pages/docs/documents'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useUserStore } from '@/store/modules/user'
import { resetNullUndefinedFields, scrollIntoViewParent } from '@/utils/common'
import { ArrowLeft, Check, CircleCheckFilled, Close, WarnTriangleFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CompareRejectForm from './components/CompareRejectForm.vue'
import DocumentCompareResult from './components/DocumentCompareResult.vue'
import ResizableSplitter from './components/ResizableSplitter.vue'
import UpdateCompareHistory from './components/UpdateCompareHistory.vue'
import { getDocumentCompare } from '@/api/docs/document/compare'
import { getBatchDetail, getDocumentDataLC, getLCAmount } from '@/api/docs/document'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { formatDate } from '@/utils/date'
import { formatYYYYMMDD_HHMM } from '@/constants/date'
import CompareSummarySkeleton from './components/CompareSummarySkeleton.vue'

const router = useRouter()
const route = useRoute()
const { showConfirmModal } = useConfirmModal()
const { isViewer, isMaker } = useUserStore()
const documentCompareConfigs = ref<DocumentCompareModel[]>([])

const { t } = useI18n()
const loading = ref(false)
const documentType = ref<DocumentKeyModel>(DocumentKeyModel.INVOICE)
const conditionSelect = ref<number>(0)
const activeName = ref<'result' | 'history'>('result')
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const compareRejectFormRef = ref<InstanceType<typeof CompareRejectForm>>()
const documentDetail = ref<BatchDetailModel>({} as BatchDetailModel)
const dataLC = ref<DocumentDataLCModel[]>([])
const amount = ref<DocumentLCAmountModel>({
  amountUsed: 0,
  totalAmount: 0
})

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
    title: t('confirm.title.confirmCompare'),
    message: t('confirm.description.confirmCompare'),
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

const handleApproveCompare = () => {
  showConfirmModal({
    title: t('confirm.title.approveCompare'),
    message: t('confirm.description.approveCompare'),
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

const handleReturnForMaker = () => {
  loadingConfirm.value = true
  setTimeout(() => {
    ElMessage.success(t('confirm.description.returnSuccess'))
    loadingConfirm.value = true
  }, 3000)
}

const handleGetDocumentCompare = async (key: DocumentKeyModel = DocumentKeyModel.INVOICE) => {
  loading.value = true
  try {
    const { data } = await getDocumentCompare({ batchId: route.params?.id as string, key })
    if (!data) return
    documentCompareConfigs.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleGetDocumentDetail = async () => {
  try {
    const { data } = await getBatchDetail(route.params?.id as string)
    documentDetail.value = data
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentAmount = async () => {
  try {
    const { data } = await getLCAmount({ batchId: route.params?.id as string })
    amount.value = resetNullUndefinedFields(data, 0) as unknown as DocumentLCAmountModel
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentDataLC = async () => {
  try {
    const { data } = await getDocumentDataLC({ batchId: route.params?.id as string })
    if (!data) return
    dataLC.value = data
  } catch (error) {
    console.error(error)
  }
}

const compareResults = computed(() => {
  return documentCompareConfigs.value.map((d) => {
    const keys = Object.keys(d.comparisonResults)
    const invalidResult = keys.some((k) => d.comparisonResults[k].status === DocumentResultEnum.DISCREPANCY)
    const status = invalidResult ? DocumentResultEnum.DISCREPANCY : DocumentResultEnum.COMPLY
    return {
      label: d.title,
      status
    }
  })
})

const documentTypeLabel = computed(() => {
  return documentTypeOptions.find((i) => i.value === documentType.value)?.label
})

const isValid = computed(() => {
  return compareResults.value.every((i) => i.status === DocumentResultEnum.COMPLY)
})

const currency = computed(() => {
  const obCurrency = dataLC.value.find((l) => l.coreKey === 'currency')
  return obCurrency?.validatedValue ?? obCurrency?.extractionValue ?? ''
})

watch(
  () => documentType.value,
  (value) => {
    handleCheckCompareResult(0)
    handleGetDocumentCompare(value)
  }
)

onMounted(() => {
  handleGetDocumentAmount()
  handleGetDocumentDetail()
  handleGetDocumentDataLC()
  handleGetDocumentCompare()
})
</script>

<template>
  <EIBDialog
    :title="$t('docs.compare.compareReject')"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    @on-confirm="compareRejectFormRef?.onConfirm"
    type="danger"
  >
    <CompareRejectForm
      ref="compareRejectFormRef"
      @update:loading="(loading: boolean) => (loadingConfirm = loading)"
      @update:visible="(visible: boolean) => (dialogVisible = visible)"
    />
    <template #footer-left
      ><el-button
        type="primary"
        plain
        @click="handleReturnForMaker"
        :loading="loadingConfirm"
        :disabled="loadingConfirm"
      >
        {{ $t('docs.compare.returnMaker') }}
      </el-button></template
    >
  </EIBDialog>

  <div
    class="flex flex-row justify-between py-2 px-4 border border-[#ced4da] fixed top-0 left-0 w-full bg-white dark:bg-[#141414] z-[10]"
  >
    <el-button color="#005d98" plain :icon="ArrowLeft" @click="handleBack">{{ $t('button.back') }}</el-button>
    <el-text class="text-[24px] mx-auto">{{ $t('docs.compare.checkDoc') }} {{ documentTypeLabel }}</el-text>
    <div class="flex flex-row gap-3" v-if="!isViewer">
      <el-button color="#c92a2a" type="danger" :icon="Close" @click="dialogVisible = true">{{
        $t('button.reject')
      }}</el-button>
      <el-button v-if="isMaker" color="#099268" type="success" :icon="Check" @click="handleConfirmCompare">{{
        $t('button.confirm')
      }}</el-button>
      <el-button v-else color="#099268" type="success" :icon="Check" @click="handleApproveCompare">{{
        $t('button.approve')
      }}</el-button>
    </div>
  </div>
  <div class="pt-20 bg-[#f1f3f5]">
    <div class="border border-t-[#e9ecef] bg-[#fff]">
      <ResizableSplitter custom-class="h-[calc(100vh_-_90px)]" :default-left-width="400">
        <template #left>
          <CompareSummarySkeleton v-if="loading" />
          <div v-else class="flex flex-col">
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <span class="c-text-value">{{ $t('docs.compare.docName') }}</span>
                <span class="text-base">{{ documentDetail?.dossierName }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="c-text-value">{{ $t('docs.compare.createdAtDoc') }}</span>
                <span class="text-base">{{ formatDate(documentDetail?.createdAt, formatYYYYMMDD_HHMM) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="c-text-value">{{ $t('docs.compare.totalAmount') }}</span>
                <span class="text-base">{{ amount?.totalAmount ?? 0 }} {{ currency }}</span>
              </div>
            </div>
            <el-divider />
            <EIBSelect v-model="documentType" :options="documentTypeOptions" label="Chứng từ đang kiểm tra" />
            <div class="flex-1 flex flex-col gap-3">
              <span>{{ $t('docs.compare.checkResult') }}</span>
              <div
                v-if="isValid"
                class="rounded-md px-3 py-2 bg-[#e6fcf5] flex flex-row gap-2 items-center w-fit text-[#099268]"
              >
                <el-icon size="20"><CircleCheckFilled /></el-icon>
                <span class="text-base">{{ $t('docs.status.valid') }}</span>
              </div>
              <div
                v-else
                class="rounded-md px-3 py-2 bg-[#fff4e6] flex flex-row gap-2 items-center w-fit text-[#d9480f]"
              >
                <el-icon size="20"><WarnTriangleFilled /></el-icon>
                <span class="text-base">{{ $t('docs.status.invalid') }}</span>
              </div>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <span>{{ $t('docs.compare.checkList') }}</span>
              <div class="flex flex-col gap-1">
                <div
                  v-for="(step, index) in compareResults"
                  :key="index"
                  class="flex flex-row gap-2 items-start cursor-pointer"
                  @click="() => handleCheckCompareResult(index)"
                >
                  <el-icon class="mb-[2px]" size="18">
                    <CircleCheckFilled class="text-[#099268]" v-if="step.status === DocumentResultEnum.COMPLY" />
                    <WarnTriangleFilled class="text-[#e03131]" v-if="step.status === DocumentResultEnum.DISCREPANCY" />
                    <CircleCheckFilled class="text-[#d8d8d8]" v-if="step.status === DocumentResultEnum.NA" />
                  </el-icon>
                  <span class="c-text-primary">{{ step.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <el-skeleton animated v-if="loading" class="h-full overflow-y-hidden" :rows="30" />
          <el-tabs v-else v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Kết quả" name="result">
              <DocumentCompareResult
                :configs="documentCompareConfigs"
                :condition-select="conditionSelect"
                @update:condition="(condition: number) => (conditionSelect = condition)"
                @scroll-by-index="handleCheckCompareResult"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('docs.compare.editHistory')" name="history">
              <UpdateCompareHistory />
            </el-tab-pane>
          </el-tabs>
        </template>
      </ResizableSplitter>
    </div>
  </div>
</template>
