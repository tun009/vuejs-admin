<script lang="ts" setup>
import { CircleCheckFilled, View, WarnTriangleFilled } from '@element-plus/icons-vue'
import { computed, nextTick, onMounted, ref } from 'vue'

import ApproveProcessDocument from './ApproveProcessDocument.vue'
import DocumentClassifyErrorModal from './DocumentClassifyErrorModal.vue'

import { DocumentStatusEnum } from '@/@types/common'
import {
  DocumentDataLCModel,
  DocumentExportFileEnum,
  DocumentLCAmountModel,
  DocumentResultEnum,
  DocumentResultModel,
  DocumentSumaryModel,
  businessTypeOptions,
  documentResultListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  documentTypeOptions
} from '@/@types/pages/docs/documents'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { downloadDocumentFile, getDocumentDataLC, getDocumentSummary, getLCAmount } from '@/api/docs/document'
import { retryComparisonDocument, retryOcrDocument } from '@/api/docs/document/compare'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import Loading from '@/components/common/EIBLoading.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { PROGRESS_COLORS } from '@/constants/color'
import { documentAfterCheckStatus, errorDocumentStatus, processingDocumentStatus } from '@/constants/common'
import { COMPARE_DOCUMENT_DETAIL_PAGE, EXTRACT_PAGE } from '@/constants/router'
import { useUserStore } from '@/store/modules/user'
import {
  customSort,
  downloadFileCommon,
  formatNumberWithCommas,
  renderLabelByValue,
  resetNullUndefinedFields
} from '@/utils/common'
import { convertOcrToDateFormat, formatDateOcrLC } from '@/utils/date'
import { successNotification } from '@/utils/notification'
import Status from '@/views/docs/components/Status.vue'
import { useRoute, useRouter } from 'vue-router'
import UpdateLCForm from './UpdateLCForm.vue'

interface Props {
  data: BatchDetailModel
}

interface Emits {
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const router = useRouter()
const route = useRoute()
const { isViewer, isMaker, isChecker, isAdmin, userInfo } = useUserStore()

const classifyModalRef = ref()
const openClassifyDrawer = ref(false)
const tableData = ref<DocumentSumaryModel[]>([])
const documentResultListTableRef = ref<InstanceType<typeof EIBTable>>()
const openApproveProcessDrawer = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const updateLCFormRef = ref<InstanceType<typeof UpdateLCForm>>()
const documentId = computed(() => route.params?.id as string)
const documentSummary = ref<DocumentResultModel>({} as DocumentResultModel)

const amount = ref<DocumentLCAmountModel>({
  amountUsed: 0,
  totalAmount: 0
})
const dataLC = ref<DocumentDataLCModel[]>([])

const handleViewDocument = (_id: string | number, type: string) => {
  router.push({
    path: COMPARE_DOCUMENT_DETAIL_PAGE(_id),
    query: {
      type
    }
  })
}

const handleGetDocumentResults = async () => {
  try {
    documentResultListTableRef.value?.setLoading(true)
    const response = await getDocumentSummary({ batchId: documentId.value })
    if (response?.data) {
      documentSummary.value = response?.data
      tableData.value = customSort(
        response?.data?.comparisonSummaries,
        'key',
        documentTypeOptions.map((item) => item.value)
      )
    }
  } catch (error) {
    console.error(error)
  } finally {
    documentResultListTableRef.value?.setLoading(false)
  }
}

const handleGetDocumentAmount = async () => {
  try {
    const { data } = await getLCAmount({ batchId: documentId.value })
    amount.value = resetNullUndefinedFields(data, 0) as unknown as DocumentLCAmountModel
  } catch (error) {
    console.error(error)
  }
}

const handleGetDocumentDataLC = async () => {
  try {
    const { data } = await getDocumentDataLC({ batchId: documentId.value })
    if (!data) return
    dataLC.value = data
  } catch (error) {
    console.error(error)
  }
}

const handleDownloadCompareResult = async (type: DocumentExportFileEnum = DocumentExportFileEnum.DOCX) => {
  try {
    const response = await downloadDocumentFile(documentId.value, { type })
    downloadFileCommon(response, type)
  } catch (error) {
    console.error(error)
  }
}

const percentage = computed(() => {
  if (!amount.value.totalAmount) return 0
  return Number(((amount.value.amountUsed / amount.value.totalAmount) * 100).toFixed(2))
})

const isOcred = computed(() => !processingDocumentStatus.includes(props.data.status))
const isValidated = computed(() => props.data.status === DocumentStatusEnum.VALIDATED)

const getValueLC = (coreKey: string): string | undefined | null => {
  const lcByKey = dataLC.value.find((lc) => lc.coreKey === coreKey)
  return lcByKey?.validatedValue ?? lcByKey?.extractionValue ?? '-'
}

const getToleranceFromText = (text: string) => {
  const keys = text.split('/')
  if (keys.length < 2) return text
  return '+/- ' + keys[0] + '%'
}

const handleRetryError = async () => {
  try {
    if (props.data.status === DocumentStatusEnum.COMPARISON_ERROR) {
      await retryComparisonDocument(props.data.id)
    } else {
      await retryOcrDocument(props.data.id)
    }
    successNotification('Hệ thống đang thử lại. Vui lòng chờ kết quả!')
    emits('refresh')
  } catch (error) {
    console.error(error)
  }
}

const redirectOcrResult = () => {
  router.push({
    path: EXTRACT_PAGE,
    query: {
      batchId: route.params?.id
    }
  })
}

const isNotHaveCompareInfo = computed(() => {
  return (
    !isOcred.value ||
    [
      DocumentStatusEnum.ERROR,
      DocumentStatusEnum.EXTRACTION_ERROR,
      DocumentStatusEnum.COMPARISON_ERROR,
      DocumentStatusEnum.CLASSIFICATION_ERROR
    ].includes(props.data?.status)
  )
})

const hasPermission = computed(() => {
  if (isAdmin) return true
  return props.data.censorBy?.username === userInfo.username || props.data.approveBy?.username === userInfo.username
})
const openModalClassify = async () => {
  openClassifyDrawer.value = true
  await nextTick()
  classifyModalRef.value?.openModalClassify()
}
const closeDialogClassify = () => {
  openClassifyDrawer.value = false
}

onMounted(() => {
  handleGetDocumentResults()
  handleGetDocumentAmount()
  handleGetDocumentDataLC()
})
</script>

<template>
  <EIBDialog
    v-if="dialogVisible"
    :title="$t('docs.detail.updateLcUsed')"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    confirm-text="Cập nhật"
    @on-confirm="updateLCFormRef?.onConfirm"
  >
    <UpdateLCForm
      ref="updateLCFormRef"
      :default-form="amount"
      @refresh="handleGetDocumentAmount"
      @update:loading="(loading: boolean) => (loadingConfirm = loading)"
      @update:visible="(visible: boolean) => (dialogVisible = visible)"
    />
  </EIBDialog>
  <el-card>
    <template #header>
      <div class="card-header">
        <div class="flex flex-col gap-3">
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">{{
            $t('docs.detail.generalInfomation')
          }}</span>
          <div class="flex flex-row">
            <div class="grid grid-cols-2 pl-3 gap-3 flex-[2]">
              <div class="flex flex-row gap-2">
                <span class="font-bold">{{ $t('docs.document.businessType') }}:</span>
                <span class="c-text-value">{{ renderLabelByValue(businessTypeOptions, data?.bizType) }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span class="font-bold">{{ $t('docs.document.customerName') }}:</span>
                <span class="c-text-value">{{ data?.customerName }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span class="font-bold">{{ $t('docs.document.sol') }}:</span>
                <span class="c-text-value">{{ data?.branch?.name }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span class="font-bold">{{ $t('docs.document.cifCode') }}:</span>
                <span class="c-text-value">{{ data?.cif }}</span>
              </div>
            </div>
            <div class="flex flex-row gap-2 flex-1">
              <span class="font-bold">{{ $t('docs.document.status') }}:</span>
              <div v-if="errorDocumentStatus.includes(data?.status)" class="flex flex-col gap-2">
                <div
                  class="flex gap-1"
                  v-if="isChecker && data?.censorBy?.name && data?.censorBy?.name !== userInfo.username"
                >
                  <Status :options="documentStatusOptions" :status="DocumentStatusEnum.CHECKED" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> {{ data?.censorBy?.name }}
                </div>
                <div class="flex gap-4" v-if="data?.status === DocumentStatusEnum.CLASSIFICATION_ERROR">
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <div
                    @click="openModalClassify()"
                    class="flex flex-row items-center gap-1 cursor-pointer"
                    v-if="hasPermission"
                  >
                    <span class="underline text-primary text-base underline-offset-2 font-semibold">Kiểm tra</span>
                    <SvgIcon :size="20" name="cheveron-right" class="cursor-pointer" />
                  </div>
                </div>
                <div class="flex gap-2" v-else>
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <div
                    class="flex flex-row items-center gap-1 cursor-pointer"
                    v-if="hasPermission"
                    @click="handleRetryError"
                  >
                    <SvgIcon :size="20" name="retry-min" class="cursor-pointer" />
                    <span class="underline text-primary text-base underline-offset-2 font-semibold">Thử lại</span>
                  </div>
                </div>
              </div>
              <div v-else-if="data?.status === DocumentStatusEnum.CHECKED" class="flex flex-col gap-2">
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> {{ data?.censorBy?.name }}
                </div>
                <el-button
                  v-if="isMaker"
                  size="large"
                  type="primary"
                  class="w-fit text-base"
                  @click="openApproveProcessDrawer = true"
                  >{{ $t('docs.document.presentationChecker') }}</el-button
                >
              </div>
              <div v-else-if="documentAfterCheckStatus.includes(data?.status)" class="flex flex-col gap-2">
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="DocumentStatusEnum.CHECKED" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> {{ data?.censorBy?.name }}
                </div>
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> {{ data?.approveBy?.name }}
                </div>
              </div>
              <div v-else class="c-text-value">
                <Status :options="documentStatusOptions" :status="data?.status" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">{{
        $t('docs.detail.lcInformation')
      }}</span>
      <div class="flex flex-row gap-8">
        <div
          class="flex-[2] relative border border-slate-200 dark:border-gray-600 rounded-md p-5 flex flex-row items-center gap-8"
        >
          <SvgIcon
            v-if="!isViewer"
            :size="24"
            name="edit-info"
            @click.stop="dialogVisible = true"
            class="cursor-pointer absolute top-3 right-3"
          />
          <el-progress
            :width="120"
            type="circle"
            :percentage="percentage"
            :stroke-width="10"
            striped-flow
            :duration="10"
            striped
            :color="PROGRESS_COLORS"
          />
          <div class="text-gray-700 dark:text-slate-300 flex flex-col gap-1">
            <span
              ><span class="text-2xl">{{ formatNumberWithCommas(amount.amountUsed) }}</span> /
              {{ formatNumberWithCommas(amount.totalAmount) }}</span
            >
            <span>{{ $t('docs.detail.lcProgress', { currency: getValueLC('currency') }) }}</span>
          </div>
        </div>
        <div class="flex-[3] grid grid-cols-2 font-bold">
          <span
            >{{ $t('docs.detail.lcNumber') }}: <span class="c-text-value">{{ getValueLC('doc_credit_no') }}</span></span
          >
          <span
            >{{ $t('docs.detail.createdAtLc') }}:
            <span class="c-text-value">{{ formatDateOcrLC(getValueLC('date_issue') ?? '') }}</span></span
          >
          <span
            >{{ $t('docs.detail.expirationDateLc') }}:
            <span class="c-text-value">{{ formatDateOcrLC(getValueLC('expiry_date') ?? '') }}</span></span
          >
          <span
            >{{ $t('docs.detail.expirationPositionLc') }}:
            <span class="c-text-value">{{ getValueLC('expiry_place') }}</span></span
          >
          <span
            >{{ $t('docs.detail.tolerance') }}:
            <span class="c-text-value">{{ getToleranceFromText(getValueLC('tolerance_percent') ?? '-') }}</span></span
          >
          <span
            >{{ $t('docs.detail.partialDelivery') }}:
            <span class="c-text-value">{{ getValueLC('partial_shipments') }}</span></span
          >
          <span
            >{{ $t('docs.detail.presentationDateDoc') }}:
            <span class="c-text-value">{{ convertOcrToDateFormat(getValueLC('upload_date') ?? '-') }}</span></span
          >
          <span
            >{{ $t('docs.detail.deadlinePresentingDoc') }}:
            <span class="c-text-value">{{ getValueLC('period_presentation') }}</span></span
          >
        </div>
      </div>
    </div>
    <el-divider class="w-[calc(100%_+_40px)] -ml-5" />
    <div class="flex flex-col gap-3">
      <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base"
        >{{ $t('docs.detail.ocrInformation') }}:</span
      >
      <div class="flex flex-row gap-4 items-center">
        <div v-if="!isOcred" class="flex flex-row gap-4 items-center">
          <Loading />
          <span>{{ $t('docs.status.processing') }}:</span>
        </div>
        <el-button :type="!isOcred ? 'info' : 'primary'" :disabled="!isOcred" @click="redirectOcrResult()">
          {{ $t('docs.detail.seeResult') }}
        </el-button>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin đối sánh</span>
          <el-dropdown v-if="!isViewer" placement="top-start" :disabled="!isValidated">
            <el-button
              :disabled="!isValidated"
              :type="!isValidated ? 'info' : 'primary'"
              class="flex flex-row items-center"
            >
              <SvgIcon name="download-inline" class="w-4 h-4 mr-2" />
              <span>{{ $t('docs.detail.downloadResult') }}</span></el-button
            >
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item class="px-2">
                  <div
                    class="flex py-3 flex-row gap-2 items-center"
                    @click="handleDownloadCompareResult(DocumentExportFileEnum.DOCX)"
                  >
                    <SvgIcon name="ic-ms-word" className="!w-5 !h-5" />
                    <span>Microsoft word (.docx)</span>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item class="px-2">
                  <div
                    class="flex py-3 flex-row gap-2 items-center"
                    @click="handleDownloadCompareResult(DocumentExportFileEnum.PDF)"
                  >
                    <SvgIcon name="ic-pdf" className="!w-5 !h-5" />
                    <span>PDF file (.pdf)</span>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="flex flex-row gap-5 pl-3 items-center">
          <div class="flex-1 flex flex-col gap-3">
            <strong>{{ $t('docs.detail.checkResult') }}</strong>
            <p v-if="isNotHaveCompareInfo" class="c-text-value">
              {{ $t('docs.detail.noInformation') }}
            </p>
            <div
              v-else-if="documentSummary?.status === DocumentResultEnum.DISCREPANCY"
              class="rounded-md px-3 py-2 bg-[#fff4e6] flex flex-row gap-2 items-center w-fit text-[#d9480f]"
            >
              <el-icon size="20"><WarnTriangleFilled /></el-icon>
              <span class="text-base">{{ $t('docs.status.invalid') }}</span>
            </div>
            <div v-else class="rounded-md px-3 py-2 bg-[#e6fcf5] flex flex-row gap-2 items-center w-fit text-[#099268]">
              <el-icon size="20"><CircleCheckFilled /></el-icon>
              <span class="text-base">{{ $t('docs.status.valid') }}</span>
            </div>
          </div>
          <div v-if="!isNotHaveCompareInfo" class="flex flex-col gap-2 flex-[2]">
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.deliveryTimeRequest') }}: </span
              ><span>{{ renderLabelByValue(documentResultOptions, documentSummary?.timeOfShipment) }}</span></span
            >
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.inLcEffect') }}: </span
              ><span>{{ renderLabelByValue(documentResultOptions, documentSummary?.lcExpiry) }}</span></span
            >
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.periodPresentationDoc') }}: </span
              ><span>{{ renderLabelByValue(documentResultOptions, documentSummary?.periodOfPresentation) }}</span></span
            >
          </div>
        </div>
        <EIBTable
          v-if="!isNotHaveCompareInfo"
          ref="documentResultListTableRef"
          locales
          hidden-pagination
          hidden-checked
          :columnConfigs="documentResultListColumnConfigs"
          :data="tableData"
          height="unset"
        >
          <template #actions="{ row }">
            <div class="flex flex-row gap-2">
              <el-button type="primary" :icon="View" @click="() => handleViewDocument(documentId, row.key)">
                {{ $t('docs.detail.detail') }}
              </el-button>
            </div>
          </template>
          <template #status="{ row }">
            <span>
              {{ renderLabelByValue(documentResultOptions, row.status) }}
            </span>
          </template>
          <template #key="{ row }">
            <span>
              {{ renderLabelByValue(documentTypeOptions, row.key) }}
            </span>
          </template>
          <template #numberSatisfiesRequirement="{ row }">
            <span
              :class="{
                'text-red-500': row.totalSatisfiedRequest !== row.totalRequest
              }"
            >
              {{ row.totalSatisfiedRequest }}/{{ row.totalRequest }}
            </span>
          </template></EIBTable
        >
      </div>
    </template>
  </el-card>

  <EIBDrawer v-model="openApproveProcessDrawer" title="docs.detail.presentationChecker">
    <template #default>
      <ApproveProcessDocument
        ref="updateUserFormRef"
        @refresh="$emit('refresh')"
        @close="openApproveProcessDrawer = false"
      />
    </template>
  </EIBDrawer>
  <EIBDrawer v-if="openClassifyDrawer" title="Danh sách chứng từ" v-model="openClassifyDrawer" size="93%">
    <template #default>
      <DocumentClassifyErrorModal
        ref="classifyModalRef"
        @close-dialog="closeDialogClassify()"
        @refresh="$emit('refresh')"
        :batch-id="route.params?.id as string"
        :error-message="props.data?.errorMessage"
      />
    </template>
  </EIBDrawer>
</template>
