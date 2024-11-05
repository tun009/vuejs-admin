<script setup lang="ts">
import EIBTable from '@/components/common/EIBTable.vue'
import { STATUS_COLORS } from '@/constants/color'
import Status from '@/views/docs/components/Status.vue'
import { ref } from 'vue'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const loading = ref(false)
const addUserFormRef = ref()
const optionStatus = ref([
  {
    label: 'Đã phê duyệt',
    value: 2,
    color: STATUS_COLORS.VALIDATED
  },
  {
    label: 'Hợp lệ',
    value: 3,
    color: STATUS_COLORS.VALIDATED
  }
])
const SOLListColumnConfigs = [
  {
    field: 'stt',
    label: '#',
    width: 70
  },
  {
    field: 'name',
    label: 'Tên chứng từ',
    width: 120
  },
  {
    field: 'ocrEdit',
    label: 'Số trường OCR có chỉnh sửa'
  },
  {
    field: 'numberEdit',
    label: 'Số yêu cầu đối sánh có chỉnh sửa',
    width: 200
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
      <p class="text-[14px]">1001ILSEIB210065_GEMACHEM_USD29,543</p>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Số LC:</p>
        <p class="text-[14px]">2B8401NS00573</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Loại nghiệp vụ:</p>
        <p class="text-[14px]">Xuất khẩu</p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">SOL:</p>
        <p class="text-[14px]">1120</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Tên khách hàng:</p>
        <p class="text-[14px]">Bùi Quang Huy</p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Trạng thái:</p>
        <p class="text-[14px]"><Status :options="optionStatus" :status="2" /></p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Kết quả xử lý:</p>
        <p class="text-[14px]"><Status :options="optionStatus" :status="3" /></p>
      </div>
    </div>
    <div class="flex mt-[16px]">
      <div class="w-[50%]">
        <p class="text-[#495057] font-bold text-[14px]">Maker:</p>
        <p class="text-[14px]">Nguyễn Thị My</p>
      </div>
      <div class="w-[50]">
        <p class="text-[#495057] font-bold text-[14px]">Checker:</p>
        <p class="text-[14px]">Lê Văn Hải</p>
      </div>
    </div>
    <div>
      <div class="mt-[16px] bg-[#f3f7fd] rounded-[4px]">
        <div class="pl-[16px] pt-[16px]">
          <p class="text-[#495057] font-bold text-[14px]">Tổng thời gian xử lý:</p>
          <p class="text-[14px]">15p 58s</p>
        </div>
        <div class="flex mt-[16px] pl-[16px] pb-[16px]">
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Hệ thống xử lý:</p>
            <p class="text-[14px]">2p 58s</p>
          </div>
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Maker xử lý:</p>
            <p class="text-[14px]">8p 02s</p>
          </div>
          <div class="w-[33%]">
            <p class="text-[#495057] font-bold text-[14px]">Checker xử lý:</p>
            <p class="text-[14px]">4p 58s</p>
          </div>
        </div>
      </div>
      <div class="mt-[28px]">
        <p class="text-[#343a40] text-[14px] font-medium mb-2">Thống kê thông tin chỉnh sửa theo loại chứng từ</p>
        <EIBTable
          :columnConfigs="SOLListColumnConfigs"
          :data="[]"
          height="100%"
          hiddenChecked
          hiddenPagination
          class="table-container"
        />
      </div>
    </div>
  </div>
  <div>
    <el-button :disabled="loading" @click="handleClose" type="default">Đóng</el-button>
  </div>
</template>
