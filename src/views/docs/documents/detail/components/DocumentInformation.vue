<script lang="ts" setup>
import { CircleCheckFilled, View, WarnTriangleFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

import ApproveProcessDocument from './ApproveProcessDocument.vue'

import { DocumentStatusEnum } from '@/@types/common'
import {
  DocumentResultModel,
  businessTypeOptions,
  documentResultListColumnConfigs,
  documentStatusOptions
} from '@/@types/pages/docs/documents'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { getDocumentResults } from '@/api/docs/document'
import EIBDialog from '@/components/common/EIBDialog.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import Loading from '@/components/common/EIBLoading.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { PROGRESS_COLORS } from '@/constants/color'
import { COMPARE_DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { DOCUMENT_RESULT_NAME_LIST } from '@/constants/select'
import { useUserStore } from '@/store/modules/user'
import { handleComingSoon, renderLabelByValue } from '@/utils/common'
import Status from '@/views/docs/components/Status.vue'
import { useRoute, useRouter } from 'vue-router'
import UpdateLCForm from './UpdateLCForm.vue'

interface Props {
  data: BatchDetailModel
}

interface Emits {
  (event: 'update:document-status'): void
}

defineProps<Props>()
defineEmits<Emits>()

const router = useRouter()
const route = useRoute()
const { isViewer, isMaker } = useUserStore()

const status = ref(1)
const percentage = ref<number>(0)
const tableData = ref<DocumentResultModel[]>([])
const documentResultListTableRef = ref<InstanceType<typeof EIBTable>>()
const openApproveProcessDrawer = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const updateLCFormRef = ref<InstanceType<typeof UpdateLCForm>>()
const documentId = computed(() => route.params?.id as string)

const handleViewDocument = (_id: string | number) => {
  router.push(COMPARE_DOCUMENT_DETAIL_PAGE(_id))
}

const handleGetDocumentResults = async () => {
  try {
    documentResultListTableRef.value?.setLoading(true)
    const response = await getDocumentResults()
    if (response?.data?.list) {
      tableData.value = response?.data?.list
    }
  } catch (error) {
    console.error(error)
  } finally {
    documentResultListTableRef.value?.setLoading(false)
  }
}

onMounted(() => {
  setInterval(() => {
    if (status.value === 2) {
      percentage.value = 0
      status.value = 0
    } else {
      percentage.value = percentage.value + 50
      status.value = status.value + 1
    }
  }, 3000)
  handleGetDocumentResults()
})
</script>

<template>
  <EIBDialog
    :title="$t('docs.detail.updateLcUsed')"
    v-model="dialogVisible"
    :loading="loadingConfirm"
    @on-confirm="updateLCFormRef?.onConfirm"
  >
    <UpdateLCForm
      ref="updateLCFormRef"
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
                <span>{{ $t('docs.document.businessType') }}:</span>
                <span class="c-text-value">{{ renderLabelByValue(businessTypeOptions, data?.bizType) }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>{{ $t('docs.document.customerName') }}:</span>
                <span class="c-text-value">{{ data?.customerName }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>{{ $t('docs.document.sol') }}:</span>
                <span class="c-text-value">{{ data?.branch?.name }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>{{ $t('docs.document.cifCode') }}:</span>
                <span class="c-text-value">{{ data?.cif }}</span>
              </div>
            </div>
            <div class="flex flex-row gap-2 flex-1">
              <span>{{ $t('docs.document.status') }}:</span>
              <div v-if="data?.status === DocumentStatusEnum.CHECKED" class="flex flex-col gap-2">
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> Trần Thị B
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
              <div
                v-else-if="
                  [
                    DocumentStatusEnum.WAIT_VALIDATE,
                    DocumentStatusEnum.ADJUST_REQUESTED,
                    DocumentStatusEnum.VALIDATED,
                    DocumentStatusEnum.DENIED
                  ].includes(data?.status)
                "
                class="flex flex-col gap-2"
              >
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="DocumentStatusEnum.CHECKED" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> Trần Thị B
                </div>
                <div class="flex gap-1">
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">{{ $t('docs.document.by') }}</span> Nguyễn Tấn D
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
            <span><span class="text-2xl">0</span> / 0</span>
            <span>{{ $t('docs.detail.lcProgress') }}</span>
          </div>
        </div>
        <div class="flex-[3] grid grid-cols-2 font-bold">
          <span
            >{{ $t('docs.detail.lcNumber') }}: <span class="c-text-value">{{ data?.docCreditNo }}</span></span
          >
          <span
            >{{ $t('docs.detail.createdAtLc') }}: <span class="c-text-value">{{ data?.dateIssue }}</span></span
          >
          <span
            >{{ $t('docs.detail.expirationDateLc') }}: <span class="c-text-value">{{ data?.expiryDate }}</span></span
          >
          <span
            >{{ $t('docs.detail.expirationPositionLc') }}:
            <span class="c-text-value">{{ data?.expiryPlace }}</span></span
          >
          <span
            >{{ $t('docs.detail.tolerance') }}: <span class="c-text-value">{{ data?.tolerancePercent }}</span></span
          >
          <span
            >{{ $t('docs.detail.partialDelivery') }}:
            <span class="c-text-value">{{ data?.partialShipments }}</span></span
          >
          <span
            >{{ $t('docs.detail.presentationDateDoc') }}:
            <span class="c-text-value">{{ data?.datePresentation }}</span></span
          >
          <span
            >{{ $t('docs.detail.deadlinePresentingDoc') }}:
            <span class="c-text-value">{{ data?.periodPresentation }}</span></span
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
        <div v-if="!status" class="flex flex-row gap-4 items-center">
          <Loading />
          <span>{{ $t('docs.status.processing') }}:</span>
        </div>
        <el-button :type="!status ? 'info' : 'primary'" :disabled="!status" @click="handleComingSoon">
          {{ $t('docs.detail.seeResult') }}
        </el-button>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin đối sánh</span>
          <el-button
            v-if="!!status && !isViewer"
            :disabled="status === 1"
            :type="status === 1 ? 'info' : 'primary'"
            class="flex flex-row items-center"
            @click.stop="handleComingSoon"
          >
            <SvgIcon name="download-inline" class="w-4 h-4 mr-2" />
            <span>{{ $t('docs.detail.downloadResult') }}</span></el-button
          >
        </div>
        <div class="flex flex-row gap-5 pl-3 items-center">
          <div class="flex-1 flex flex-col gap-3">
            <strong>{{ $t('docs.detail.checkResult') }}</strong>
            <p v-if="!status" class="c-text-value">{{ $t('docs.detail.noInformation') }}</p>
            <div
              v-else-if="status === 1"
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
          <div v-if="!!status" class="flex flex-col gap-2 flex-[2]">
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.deliveryTimeRequest') }}: </span
              ><span>{{ $t('docs.status.valid') }}</span></span
            >
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.inLcEffect') }}: </span
              ><span>{{ $t('docs.status.valid') }}</span></span
            >
            <span
              ><span class="font-semibold mr-2">{{ $t('docs.detail.periodPresentationDoc') }}: </span
              ><span>{{ $t('docs.status.valid') }}</span></span
            >
          </div>
        </div>
        <EIBTable
          v-if="!!status"
          ref="documentResultListTableRef"
          locales
          hidden-pagination
          hidden-checked
          :columnConfigs="documentResultListColumnConfigs"
          :data="tableData"
          height="unset"
        >
          <template #actions>
            <div class="flex flex-row gap-2">
              <el-button type="primary" :icon="View" @click="() => handleViewDocument(documentId)">
                {{ $t('docs.detail.detail') }}
              </el-button>
            </div>
          </template>
          <template #testResults>
            <span>
              {{ status === 1 ? DOCUMENT_RESULT_NAME_LIST[1] : DOCUMENT_RESULT_NAME_LIST[0] }}
            </span>
          </template>
          <template #numberSatisfiesRequirement>
            <span
              :class="{
                'text-red-500': status === 1
              }"
            >
              {{ status === 1 ? '8/9' : '8/8' }}
            </span>
          </template></EIBTable
        >
      </div>
    </template>
  </el-card>

  <EIBDrawer v-model="openApproveProcessDrawer" :title="$t('docs.detail.presentationChecker')">
    <template #default>
      <ApproveProcessDocument
        ref="updateUserFormRef"
        @success="$emit('update:document-status')"
        @close="openApproveProcessDrawer = false"
      />
    </template>
  </EIBDrawer>
</template>
