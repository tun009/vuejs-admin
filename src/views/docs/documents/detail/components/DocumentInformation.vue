<script lang="ts" setup>
import { CircleCheckFilled, View, WarnTriangleFilled } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

import ApproveProcessDocument from './ApproveProcessDocument.vue'

import {
  DocumentResultModel,
  businessTypeOptions,
  documentResultListColumnConfigs,
  documentStatusOptions
} from '@/@types/pages/docs/documents'
import { getDocumentResults } from '@/api/docs/document'
import Loading from '@/components/common/EIBLoading.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { handleComingSoon, renderLabelByValue } from '@/utils/common'
import { PROGRESS_COLORS } from '@/constants/color'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import { useRoute, useRouter } from 'vue-router'
import { COMPARE_DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { DOCUMENT_RESULT_NAME_LIST } from '@/constants/select'
import UpdateLCForm from './UpdateLCForm.vue'
import EIBDialog from '@/components/common/EIBDialog.vue'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { DocumentStatusEnum } from '@/@types/common'
import Status from '@/views/docs/components/Status.vue'

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

const status = ref(1)
const percentage = ref<number>(0)
const tableData = ref<DocumentResultModel[]>([])
const documentResultListTableRef = ref<InstanceType<typeof EIBTable>>()
const openApproveProcessDrawer = ref(false)
const dialogVisible = ref(false)
const loadingConfirm = ref(false)
const updateLCFormRef = ref<InstanceType<typeof UpdateLCForm>>()

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

const documentId = computed(() => route.params?.id as string)
</script>

<template>
  <EIBDialog
    title="Cập nhập Tổng trị giá LC đã sử dụng"
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
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin chung</span>
          <div class="flex flex-row">
            <div class="grid grid-cols-2 pl-3 gap-3 flex-[2]">
              <div class="flex flex-row gap-2">
                <span>Loại nghiệp vụ:</span>
                <span class="c-text-value">{{ renderLabelByValue(businessTypeOptions, data?.bizType) }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>Tên khách hàng:</span>
                <span class="c-text-value">{{ data?.customerName }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>SOL:</span>
                <span class="c-text-value">{{ data?.branch?.name }}</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>Mã CIF:</span>
                <span class="c-text-value">{{ data?.cif }}</span>
              </div>
            </div>
            <div class="flex flex-row gap-2 flex-1">
              <span>Trạng thái:</span>
              <div v-if="data?.status === DocumentStatusEnum.CHECKED" class="flex flex-col gap-2">
                <div>
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">bởi</span> Trần Thị B
                </div>
                <el-button size="large" type="primary" class="w-fit text-base" @click="openApproveProcessDrawer = true"
                  >Trình checker</el-button
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
                <div>
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">bởi</span> Trần Thị B
                </div>
                <div>
                  <Status :options="documentStatusOptions" :status="data?.status" />
                  <span class="c-text-value">bởi</span> Nguyễn Tấn D
                </div>
              </div>
              <div class="c-text-value">
                <Status :options="documentStatusOptions" :status="data?.status" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-3">
      <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin LC</span>
      <div class="flex flex-row gap-8">
        <div
          class="flex-[2] relative border border-slate-200 dark:border-gray-600 rounded-md p-5 flex flex-row items-center gap-8"
        >
          <SvgIcon
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
            <span>Tổng trị giá LC đã sử dụng (USD) / Tổng giá trị LC</span>
          </div>
        </div>
        <div class="flex-[3] grid grid-cols-2 font-semibold">
          <span
            >Số LC: <span class="c-text-value">{{ data?.docCreditNo }}</span></span
          >
          <span
            >Ngày lập LC: <span class="c-text-value">{{ data?.dateIssue }}</span></span
          >
          <span
            >Ngày hết hạn LC: <span class="c-text-value">{{ data?.expiryDate }}</span></span
          >
          <span
            >Nơi hết hạn LC: <span class="c-text-value">{{ data?.expiryPlace }}</span></span
          >
          <span
            >Dung sai: <span class="c-text-value">{{ data?.tolerancePercent }}</span></span
          >
          <span
            >Giao hàng từng phần: <span class="c-text-value">{{ data?.partialShipments }}</span></span
          >
          <span
            >Ngày xuất trình chứng từ: <span class="c-text-value">{{ data?.datePresentation }}</span></span
          >
          <span
            >Thời hạn xuất trình chứng từ: <span class="c-text-value">{{ data?.periodPresentation }}</span></span
          >
        </div>
      </div>
    </div>
    <el-divider class="w-[calc(100%_+_40px)] -ml-5" />
    <div class="flex flex-col gap-3">
      <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin OCR</span>
      <div class="flex flex-row gap-4 items-center">
        <div v-if="!status" class="flex flex-row gap-4 items-center">
          <Loading />
          <span>Đang xử lý</span>
        </div>
        <el-button :type="!status ? 'info' : 'primary'" :disabled="!status" @click="handleComingSoon">
          Xem kết quả
        </el-button>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-col gap-5">
        <div class="flex flex-row justify-between items-center">
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin đối sánh</span>
          <el-button
            v-if="!!status"
            :disabled="status === 1"
            :type="status === 1 ? 'info' : 'primary'"
            class="flex flex-row items-center"
            @click.stop="handleComingSoon"
          >
            <SvgIcon name="download-inline" class="w-4 h-4 mr-2" />
            <span>Tải kết quả</span></el-button
          >
        </div>
        <div class="flex flex-row gap-5 pl-3 items-center">
          <div class="flex-1 flex flex-col gap-3">
            <strong>Kết quả kiểm tra</strong>
            <p v-if="!status" class="c-text-value">Chưa có thông tin</p>
            <div
              v-else-if="status === 1"
              class="rounded-md px-3 py-2 bg-[#fff4e6] flex flex-row gap-2 items-center w-fit text-[#d9480f]"
            >
              <el-icon size="20"><WarnTriangleFilled /></el-icon>
              <span class="text-base">Bất hợp lệ</span>
            </div>
            <div v-else class="rounded-md px-3 py-2 bg-[#e6fcf5] flex flex-row gap-2 items-center w-fit text-[#099268]">
              <el-icon size="20"><CircleCheckFilled /></el-icon>
              <span class="text-base">Hợp lệ</span>
            </div>
          </div>
          <div v-if="!!status" class="flex flex-col gap-2 flex-[2]">
            <span><span class="font-semibold mr-2">Thời gian giao hàng so với yêu cầu: </span><span>Hợp lệ</span></span>
            <span><span class="font-semibold mr-2">Trong hiệu lực LC: </span><span>Hợp lệ</span></span>
            <span><span class="font-semibold mr-2">Trong thời hạn xuất trình chứng từ: </span><span>Hợp lệ</span></span>
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
                Chi tiết
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
          </template>
          <template #stt="{ index }">
            <span>{{ index + 1 }}</span>
          </template></EIBTable
        >
      </div>
    </template>
  </el-card>

  <EIBDrawer v-model="openApproveProcessDrawer" title="Trình checker phê duyệt bộ chứng từ">
    <template #default>
      <ApproveProcessDocument
        ref="updateUserFormRef"
        @success="$emit('update:document-status')"
        @close="openApproveProcessDrawer = false"
      />
    </template>
  </EIBDrawer>
</template>
