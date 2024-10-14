<script lang="ts" setup>
import { ArrowLeft, Check, CircleCheckFilled, Close, WarnTriangleFilled } from '@element-plus/icons-vue'
import ResizableSplitter from './components/ResizableSplitter.vue'
import Select from '@/components/common/Select.vue'
import { ref } from 'vue'
import { documentTypeOptions } from '@/@types/pages/docs/documents'
import DocumentCompareResult from './components/DocumentCompareResult.vue'

const documentType = ref(0)
const checked = ref(0)
const activeName = ref('result')

const temp = [
  {
    label: 'Số bản xuất trình',
    status: 'valid'
  },
  {
    label: 'Tên chứng từ',
    status: 'valid'
  },
  {
    label: 'Ngày lập hóa đơn, người lập invoice',
    status: 'invalid'
  },
  {
    label: 'Hóa đơn phát hành cho Applicant ',
    status: 'valid'
  },
  {
    label: 'Chữ ký',
    status: 'valid'
  },
  {
    label: 'Nội dung thể hiện trên Invoice không mẫu thuẫn nhau',
    status: 'valid'
  },
  {
    label: 'Sự đồng nhất thông tin Invoice với các chứng từ khác (1:1)',
    status: 'valid'
  },
  {
    label: 'Thông tin hàng hóa',
    status: 'invalid'
  },
  {
    label: 'Thông tin yêu cầu từ 46A (LC)',
    status: 'valid'
  },
  {
    label: 'Thông tin yêu cầu từ 47A (LC)',
    status: 'inprogress'
  }
]
</script>

<template>
  <div
    class="flex flex-row justify-between py-2 px-4 border border-[#ced4da] fixed top-0 left-0 w-full bg-white dark:bg-[#141414]"
  >
    <el-button plain :icon="ArrowLeft">Trở lại</el-button>
    <el-text>Kiểm tra chứng từ Invoice</el-text>
    <div class="flex flex-row gap-3">
      <el-button type="danger" :icon="Close">Từ chối</el-button>
      <el-button type="success" :icon="Check">Xác nhận</el-button>
    </div>
  </div>
  <div>
    <div class="mt-20 border border-t-[#e9ecef]">
      <ResizableSplitter>
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
            <Select v-model="documentType" :options="documentTypeOptions" label="Chứng từ đang kiểm tra" />
            <div class="flex-1 flex flex-col gap-3">
              <span>Kết quả kiểm tra</span>
              <div class="rounded-md px-3 py-2 bg-[#fff4e6] flex flex-row gap-2 items-center w-fit text-[#d9480f]">
                <el-icon size="24"><WarnTriangleFilled /></el-icon>
                <span class="text-base">Bất hợp lệ</span>
              </div>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <span>Danh sách kiểm tra</span>
              <div class="flex flex-col gap-1">
                <div
                  v-for="(step, index) in temp"
                  :key="index"
                  class="flex flex-row gap-2 items-start cursor-pointer"
                  @click="checked = index"
                >
                  <el-icon class="mt-1" size="18">
                    <CircleCheckFilled class="text-[#099268]" v-if="step.status === 'valid'" />
                    <WarnTriangleFilled class="text-[#e03131]" v-if="step.status === 'invalid'" />
                    <CircleCheckFilled class="text-[#d8d8d8]" v-if="step.status === 'inprogress'" />
                  </el-icon>
                  <span :class="{ 'font-bold': index === checked }" class="text-[#005d98]"
                    >{{ index + 1 }}. {{ step.label }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #right>
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="Kết quả" name="result">
              <DocumentCompareResult />
            </el-tab-pane>
            <el-tab-pane label="Lịch sử chỉnh sửa" name="history">Lịch sử chỉnh sửa</el-tab-pane>
          </el-tabs>
        </template>
      </ResizableSplitter>
    </div>
  </div>
</template>

<style scoped></style>
