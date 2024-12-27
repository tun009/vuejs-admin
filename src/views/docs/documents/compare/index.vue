<script lang="ts" setup>
import { DocumentStatusEnum, SelectOptionModel } from '@/@types/common'
import {
  CompareHistoryCustomModel,
  DocumentCompareModel,
  DocumentDataLCModel,
  DocumentKeyEnum,
  DocumentLCAmountModel,
  DocumentResultEnum,
  DocumentSelectTypeKeyEnum,
  documentSelectTypeOptions,
  documentTypeOptions,
  getAllCategoryRequestModel,
  getAllRuleRequestModel
} from '@/@types/pages/docs/documents'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { RuleModel } from '@/@types/pages/rules'
import { RoleEnum } from '@/@types/pages/users'
import { getBatchDetail, getDocumentDataLC, getDocumentHistories, getLCAmount } from '@/api/docs/document'
import { getDocumentCompare, updateDocumentStatus } from '@/api/docs/document/compare'
import { getRules } from '@/api/rules'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { checkerStepDocumentStatus, endedDocumentStatus, makerStepDocumentStatus } from '@/constants/common'
import { _formatDDMMYYYY_HHmm } from '@/constants/date'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useUserStore } from '@/store/modules/user'
import {
  convertFileUrl,
  formatNumberWithCommas,
  getTextFromHtml,
  handleConvertDocumentHistory,
  resetNullUndefinedFields,
  scrollIntoViewParent
} from '@/utils/common'
import { formatDate } from '@/utils/date'
import { ArrowLeft, Check, CircleCheckFilled, Close, WarnTriangleFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { sortBy } from 'lodash-es'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CompareRejectForm from './components/CompareRejectForm.vue'
import CompareReturnForm from './components/CompareReturnForm.vue'
import CompareSummarySkeleton from './components/CompareSummarySkeleton.vue'
import DocumentCompareResult from './components/DocumentCompareResult.vue'
import ResizableSplitter from './components/ResizableSplitter.vue'
import UpdateCompareHistory from './components/UpdateCompareHistory.vue'
import { getDocummentTypeApi, getDossierListApi } from '@/api/extract'
import PreviewDocument from './components/PreviewDocument.vue'

const router = useRouter()
const route = useRoute()
const { showConfirmModal } = useConfirmModal()
const { isViewer, isMaker, isChecker, userInfo } = useUserStore()
const documentCompareConfigs = ref<DocumentCompareModel[]>([])

const { t } = useI18n()

const pathFile = ref<string>('')
const compareResultMinWidth = ref<number | null>(null)
const loading = ref(false)
const documentType = ref<DocumentKeyEnum>((route.query?.type as DocumentKeyEnum) ?? DocumentKeyEnum.INVOICE)
const conditionSelect = ref<number>(0)
const activeName = ref<'result' | 'history'>('result')
const dialogVisible = ref(false)
const dialogReturnVisible = ref(false)
const loadingConfirm = ref(false)
const loadingConfirmReturnMaker = ref(false)
const categories = ref<RuleModel[]>([])
const rules = ref<RuleModel[]>([])
const compareRejectFormRef = ref<InstanceType<typeof CompareRejectForm>>()
const compareReturnFormRef = ref<InstanceType<typeof CompareReturnForm>>()
const documentDetail = ref<BatchDetailModel>({} as BatchDetailModel)
const dataLC = ref<DocumentDataLCModel[]>([])
const docTypeOptions = ref<SelectOptionModel[]>([])
const docType = ref<DocumentSelectTypeKeyEnum>()
const compareHistories = ref<CompareHistoryCustomModel[]>([])
const amount = ref<DocumentLCAmountModel>({
  amountUsed: 0,
  totalAmount: 0
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

const batchId = computed(() => {
  return route.params?.id as string
})

const handleCheckCompareResult = (index: number) => {
  try {
    if (activeName.value === 'history') {
      activeName.value = 'result'
    }
    conditionSelect.value = index
    const id = `document-compare-${index}`
    setTimeout(() => {
      scrollIntoViewParent(id)
    }, 100)
  } catch (error) {
    console.error(error)
  }
}

const handleBack = () => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
    .then(() => {
      router.push(DOCUMENT_DETAIL_PAGE(batchId.value))
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
      router.push(DOCUMENT_DETAIL_PAGE(batchId.value))
    },
    onConfirm: async (instance, done) => {
      try {
        await updateDocumentStatus(batchId.value, {
          approveDossier: DocumentStatusEnum.CHECKED
        })
      } catch (error) {
        console.error(error)
      } finally {
        done()
        instance.confirmButtonLoading = false
      }
    }
  })
}

const handleApproveCompare = () => {
  showConfirmModal({
    title: t('confirm.title.approveCompare'),
    message: t('confirm.description.approveCompare'),
    successCallback: () => {
      router.push(DOCUMENT_DETAIL_PAGE(batchId.value))
    },
    onConfirm: async (instance, done) => {
      try {
        await updateDocumentStatus(batchId.value, {
          approveDossier: DocumentStatusEnum.VALIDATED
        })
        dialogVisible.value = false
      } catch (error) {
        console.error(error)
      } finally {
        done()
        instance.confirmButtonLoading = false
      }
    }
  })
}

const handleGetDocumentCompare = async (key: DocumentKeyEnum, haveLoading: boolean = true) => {
  if (haveLoading) {
    loading.value = true
  }
  try {
    const { data } = await getDocumentCompare({ batchId: batchId.value, key })
    if (!data) return
    const temp = data.map((item) => ({ ...item, sort: Number(item.title.split('.')?.[0] ?? 0) }))
    const dataMapping = sortBy(temp, 'sort')
    documentCompareConfigs.value = dataMapping
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleGetDocumentDetail = async () => {
  try {
    const { data } = await getBatchDetail(batchId.value)
    documentDetail.value = data
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentAmount = async () => {
  try {
    const { data } = await getLCAmount({ batchId: batchId.value })
    amount.value = resetNullUndefinedFields(data, 0) as unknown as DocumentLCAmountModel
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentDataLC = async () => {
  try {
    const { data } = await getDocumentDataLC({ batchId: batchId.value })
    if (!data) return
    dataLC.value = data
  } catch (error) {
    console.error(error)
  }
}

const handleGetCategories = async () => {
  try {
    const response = await getRules(getAllCategoryRequestModel)
    if (!response?.data?.list) return
    categories.value = response.data.list?.map((c) => ({
      ...c,
      en: getTextFromHtml(c.en)
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleGetRules = async () => {
  try {
    const response = await getRules(getAllRuleRequestModel)
    if (!response?.data?.list) return
    rules.value = response.data.list
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleGetDocumentHistories = async () => {
  try {
    const response = await getDocumentHistories(route.params?.id as string)
    const mappingData = handleConvertDocumentHistory(response.data)
    compareHistories.value = mappingData
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocTypes = async () => {
  try {
    const { data } = await getDocummentTypeApi()
    const checkKeys = documentSelectTypeOptions.map((item) => item.value)
    const exactData = data.filter((d) => checkKeys.includes(d.key))
    const dataMapping: SelectOptionModel[] = exactData?.map((e) => {
      const label = documentSelectTypeOptions.find((d) => d.value === e.key)?.label ?? ''
      return {
        label,
        value: e.key
      }
    })
    docTypeOptions.value = [...dataMapping]
    if (!docTypeOptions.value.length) return
    if (docType.value !== docTypeOptions.value?.[0]?.value) {
      docType.value = docTypeOptions.value?.[0]?.value
    }
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentByType = async () => {
  try {
    const { data } = await getDossierListApi(route.params?.id as string, docType.value)
    if (!data.length) return
    pathFile.value = data?.[0]?.pathFile ?? ''
  } catch (error) {
    console.error(error)
  }
}

const compareResults = computed(() => {
  return documentCompareConfigs.value.map((d) => ({
    label: d.title,
    status: d.status
  }))
})

const isHaveActionButton = computed(() => {
  const status = documentDetail.value.status
  if (isViewer || !status || endedDocumentStatus.includes(status)) return false
  if (isMaker) {
    if (makerStepDocumentStatus.includes(status)) return true
    return false
  }
  if (isChecker) {
    if (
      (checkerStepDocumentStatus.includes(status) && documentDetail.value.approveBy?.username === userInfo.username) ||
      userInfo.username === documentDetail.value?.createdBy?.username
    )
      return true
    return false
  }
  return true
})

const isDisabledReturnMaker = computed(() => {
  if (loadingConfirmReturnMaker.value) return true
  if (documentDetail.value?.createdBy?.role !== RoleEnum.MAKER) return true
  return false
})

const handleGetWidth = () => {
  const element = document.getElementById('compare-body')
  const width = element?.offsetWidth
  if (!width) return
  compareResultMinWidth.value = Number(Number(width * 0.56).toFixed(0))
}

watch(
  () => documentType.value,
  (value) => {
    handleCheckCompareResult(0)
    handleGetDocumentCompare(value)
    router.replace({
      path: route.path,
      query: {
        type: documentType.value
      }
    })
  }
)

watch(
  () => docType.value,
  (value) => {
    if (value) {
      handleGetDocumentByType()
    }
  }
)

onMounted(() => {
  handleGetWidth()
  handleGetDocumentAmount()
  handleGetDocumentDetail()
  handleGetDocumentDataLC()
  handleGetDocumentCompare(documentType.value)
  handleGetDocumentHistories()
  handleGetDocTypes()
  if (isViewer) return
  handleGetCategories()
  handleGetRules()
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
  </EIBDialog>

  <EIBDialog
    :title="$t('docs.compare.compareReturn')"
    v-model="dialogReturnVisible"
    :loading="loadingConfirmReturnMaker"
    @on-confirm="compareReturnFormRef?.onConfirm"
    type="danger"
  >
    <CompareReturnForm
      ref="compareReturnFormRef"
      :maker="documentDetail.censorBy?.username ?? ''"
      @update:loading="(loading: boolean) => (loadingConfirmReturnMaker = loading)"
      @update:visible="(visible: boolean) => (dialogReturnVisible = visible)"
    />
  </EIBDialog>

  <div
    class="flex flex-row justify-between py-2 px-4 border border-[#ced4da] fixed top-0 left-0 w-full bg-white dark:bg-[#141414] z-[10]"
  >
    <el-button color="#005d98" plain :icon="ArrowLeft" @click="handleBack">{{ $t('button.back') }}</el-button>
    <el-text class="text-[20px] pl-32 mx-auto">{{ $t('docs.compare.checkDoc') }} {{ documentTypeLabel }}</el-text>
    <div class="flex flex-row" v-if="isHaveActionButton">
      <el-button
        v-if="!isMaker"
        :disabled="isDisabledReturnMaker"
        type="primary"
        plain
        @click="dialogReturnVisible = true"
        >{{ $t('button.return') }}</el-button
      >
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
  <div class="pt-16 bg-[#f1f3f5] document-compare">
    <div class="border border-t-[#e9ecef] bg-[#fff]">
      <ResizableSplitter custom-class="h-[calc(100vh_-_90px)]" :default-left-width="300">
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
                <span class="text-base">{{ formatDate(documentDetail?.createdAt, _formatDDMMYYYY_HHmm) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="c-text-value">{{ $t('docs.compare.totalAmount') }}</span>
                <span class="text-base">{{ formatNumberWithCommas(amount?.totalAmount ?? 0) }} {{ currency }}</span>
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
                  <span class="c-text-primary" :class="{ 'font-bold': index === conditionSelect }">{{
                    step.label
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <el-skeleton animated v-if="loading" class="h-full overflow-y-hidden" :rows="30" />
          <el-tabs v-else v-model="activeName" class="demo-tabs h-full" id="compare-body">
            <el-tab-pane label="Kết quả" name="result">
              <ResizableSplitter
                custom-id="result"
                custom-class="h-[calc(100vh_-_180px)] !p-0"
                :default-left-width="compareResultMinWidth ?? 600"
                :min-width="500"
              >
                <template #left>
                  <DocumentCompareResult
                    :configs="documentCompareConfigs"
                    :condition-select="conditionSelect"
                    :categories="categories"
                    :rules="rules"
                    :is-have-permission="isHaveActionButton"
                    @update:condition="(condition: number) => (conditionSelect = condition)"
                    @scroll-by-index="handleCheckCompareResult"
                    @refresh="handleGetDocumentCompare(documentType, false)"
                  />
                </template>
                <template #right>
                  <PreviewDocument v-if="pathFile" :key="pathFile" :url="convertFileUrl(pathFile)">
                    <template #right-header>
                      <EIBSelect
                        v-model="docType"
                        hidden-error
                        name="docType"
                        :options="docTypeOptions"
                        class="!w-32"
                      />
                    </template>
                  </PreviewDocument>
                </template>
              </ResizableSplitter>
            </el-tab-pane>
            <el-tab-pane :label="$t('docs.compare.editHistory')" name="history">
              <UpdateCompareHistory :compare-histories="compareHistories" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </ResizableSplitter>
    </div>
  </div>
</template>

<style>
.document-compare .el-table tr th {
  background-color: #f5f5f5 !important;
  color: #495057;
}
</style>
