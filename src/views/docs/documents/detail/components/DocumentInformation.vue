<script lang="ts" setup>
import { CircleCheckFilled, View, WarnTriangleFilled } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

import ApproveProcessDocument from './ApproveProcessDocument.vue'

import { DocumentResultModel, documentResultListColumnConfigs } from '@/@types/pages/docs/documents'
import { getDocumentResults } from '@/api/docs/document'
import Loading from '@/components/common/EIBLoading.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { handleComingSoon } from '@/utils/common'
import { PROGRESS_COLORS } from '@/constants/color'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import { useRouter } from 'vue-router'
import { COMPARE_DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { DOCUMENT_RESULT_NAME_LIST } from '@/constants/select'

const router = useRouter()

const status = ref(1)
const documentStatus = ref(2)
const percentage = ref<number>(0)
const tableData = ref<DocumentResultModel[]>([])
const documentResultListTableRef = ref<InstanceType<typeof EIBTable>>()
const openApproveProcessDrawer = ref(false)

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
  // setInterval(() => {
  //   if (documentStatus.value === 5) {
  //     documentStatus.value = 0
  //   } else {
  //     documentStatus.value = documentStatus.value + 1
  //   }
  // }, 3000)
  handleGetDocumentResults()
})
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <div class="flex flex-col gap-3">
          <span class="text-[#005d98] dark:text-[#409eff] font-semibold text-base">Thông tin chung</span>
          <div class="flex flex-row">
            <div class="grid grid-cols-2 pl-3 gap-3 flex-[2]">
              <div class="flex flex-row gap-2">
                <span>Loại nghiệp vụ:</span>
                <span class="c-text-value">Xuất khẩu</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>Tên khách hàng:</span>
                <span class="c-text-value">COFIDEC</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>SOL:</span>
                <span class="c-text-value">1234</span>
              </div>
              <div class="flex flex-row gap-2">
                <span>Mã CIF:</span>
                <span class="c-text-value">1234</span>
              </div>
            </div>
            <div class="flex flex-row gap-2 flex-1">
              <span>Trạng thái:</span>
              <div v-if="!documentStatus || documentStatus === 1" class="c-text-value">
                <div class="c-text-value">
                  {{ documentStatus === 0 ? 'Đang xử lý OCR' : documentStatus === 1 ? 'Đã đối sánh' : '' }}
                </div>
              </div>
              <div v-else-if="documentStatus === 2" class="flex flex-col gap-2">
                <div>Đã kiểm tra <span class="c-text-value">bởi</span> Trần Thị B</div>
                <el-button size="large" type="primary" class="w-fit text-base" @click="openApproveProcessDrawer = true"
                  >Trình checker</el-button
                >
              </div>
              <div v-else class="flex flex-col gap-2">
                <div>Đã kiểm tra <span class="c-text-value">bởi</span> Trần Thị B</div>
                <div>
                  {{ documentStatus === 5 ? 'Đã phê dyệt' : documentStatus === 4 ? 'Từ chối' : 'Chờ phê duyệt' }}
                  <span class="c-text-value">bởi</span> Nguyễn Tấn D
                </div>
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
          class="flex-[2] border border-slate-200 dark:border-gray-600 rounded-md p-5 flex flex-row items-center gap-8"
        >
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
            <span>Tổng trị giá LC đã sử dụng (USD)</span>
          </div>
        </div>
        <div class="flex-[3] grid grid-cols-2 font-semibold">
          <span>Số LC: <span class="c-text-value">2B8401NS00573</span></span>
          <span>Ngày lập LC: <span class="c-text-value">01/01/2024</span></span>
          <span>Ngày hết hạn LC: <span class="c-text-value">01/01/2025</span></span>
          <span>Nơi hết hạn LC: <span class="c-text-value">Vietnam</span></span>
          <span>Dung sai: <span class="c-text-value">+/- 5%</span></span>
          <span>Giao hàng từng phần: <span class="c-text-value">Not Allowed</span></span>
          <span>Ngày xuất trình chứng từ: <span class="c-text-value">-</span></span>
          <span>Thời hạn xuất trình chứng từ: <span class="c-text-value">21 days</span></span>
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
              <el-icon size="24"><WarnTriangleFilled /></el-icon>
              <span class="text-base">Bất hợp lệ</span>
            </div>
            <div v-else class="rounded-md px-3 py-2 bg-[#e6fcf5] flex flex-row gap-2 items-center w-fit text-[#099268]">
              <el-icon size="24"><CircleCheckFilled /></el-icon>
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
          <template #actions="{ row }">
            <div class="flex flex-row gap-2">
              <el-button type="primary" :icon="View" @click="() => handleViewDocument(row.id)"> Chi tiết </el-button>
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
        @success="documentStatus = 3"
        @close="openApproveProcessDrawer = false"
      />
    </template>
  </EIBDrawer>
</template>

<style scoped></style>
