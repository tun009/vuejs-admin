<script setup lang="ts">
import EIBTable from '@/components/common/EIBTable.vue'
import Status from '@/views/docs/components/Status.vue'
import { ref } from 'vue'
import { ReportDetailModel } from '@/@types/pages/reports'
import { documentStatusOptions, documentResultOptions } from '@/@types/pages/docs/documents'
interface Props {
  data: ReportDetailModel
}

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const loading = ref(false)
const addUserFormRef = ref()
const SOLListColumnConfigs = [
  {
    field: 'stt',
    label: '#',
    width: 70
  },
  {
    field: 'docType',
    label: 'Tên chứng từ'
  },
  {
    field: 'totalFieldEdit',
    label: 'Số trường OCR có chỉnh sửa'
  },
  {
    field: 'totalRequestComparisonEdit',
    label: 'Số yêu cầu đối sánh có chỉnh sửa'
  }
]

const handleClose = () => {
  emits('close')
  addUserFormRef.value.resetFields()
}

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <div>
    <div>
      <p class="text-[#495057] font-bold text-[14px]">Tên bộ chứng từ:</p>
      <p class="text-[14px]">{{ props.data?.name }}</p>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Số LC:</p>
        <p class="text-[14px]">{{ props.data?.lcNo }}</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Loại nghiệp vụ:</p>
        <p class="text-[14px]">{{ props.data?.bizType }}</p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">SOL:</p>
        <p class="text-[14px]">{{ props.data?.branch?.name }}</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Tên khách hàng:</p>
        <p class="text-[14px]">{{ props.data?.customerName }}</p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Trạng thái:</p>
        <p class="text-[14px]"><Status :options="documentStatusOptions" :status="props.data?.status" /></p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Kết quả xử lý:</p>
        <p class="text-[14px]"><Status :options="documentResultOptions" :status="props.data?.result" /></p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Maker:</p>
        <p class="text-[14px]">{{ props.data?.maker?.name }}</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Checker:</p>
        <p class="text-[14px]">{{ props.data?.checker?.name }}</p>
      </div>
    </div>
    <div>
      <div class="mt-[16px] bg-[#f3f7fd] rounded-[4px]">
        <div class="pl-[16px] pt-[16px]">
          <p class="text-[#495057] font-bold text-[14px]">Tổng thời gian xử lý:</p>
          <p class="text-[14px]">{{ props.data?.totalTimeProcessHandle }}</p>
        </div>
        <div class="flex mt-[16px] pl-[16px] pb-[16px]">
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Hệ thống xử lý:</p>
            <p class="text-[14px]">{{ props.data?.timeSystemHandle }}</p>
          </div>
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Maker xử lý:</p>
            <p class="text-[14px]">{{ props.data?.timeMakerHandle }}</p>
          </div>
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Checker xử lý:</p>
            <p class="text-[14px]">{{ props.data?.timeCheckerHandle }}</p>
          </div>
        </div>
      </div>
      <div class="mt-[28px]">
        <p class="text-[#343a40] text-[14px] font-medium mb-2">Thống kê thông tin chỉnh sửa theo loại chứng từ</p>
        <EIBTable
          :columnConfigs="SOLListColumnConfigs"
          :data="props.data?.statDossier"
          height="100%"
          hiddenChecked
          hiddenPagination
          class="table-container"
        >
          <template #totalFieldEdit="{ row }">
            <span v-if="row?.totalFieldEdit != null">{{ row?.totalFieldEdit }}/{{ row?.totalFieldOcr }}</span>
            <span v-else>-</span>
          </template>
          <template #totalRequestComparisonEdit="{ row }">
            <span v-if="row?.totalRequestComparisonEdit != null"
              >{{ row?.totalRequestComparisonEdit }}/{{ row?.totalRequestComparison }}</span
            >
            <span v-else>-</span>
          </template>
        </EIBTable>
      </div>
    </div>
  </div>
  <div>
    <el-button :disabled="loading" @click="handleClose" type="default">Đóng</el-button>
  </div>
</template>
