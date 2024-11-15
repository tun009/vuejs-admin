<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (event: 'close'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const tableData = [
  {
    name: 'Tổng quan',
    title: 1
  },
  {
    name: 'Quản lý chứng từ',
    title: 1
  },
  {
    name: 'Xem thông tin các bộ chứng từ',
    title: 2
  },
  {
    name: 'Thêm bộ chứng từ',
    title: 2
  },
  {
    name: 'Cập nhật thông tin bộ chứng từ',
    title: 2
  },
  {
    name: 'Xóa bộ chứng từ',
    title: 2
  },
  {
    name: 'Trích xuất thông tin',
    title: 1
  },
  {
    name: 'Xem kết quả sau khi OCR hoàn tất',
    title: 2
  },
  {
    name: 'Chỉnh sửa thông tin sau khi OCR hoàn tất',
    title: 2
  },
  {
    name: 'Phê duyệt kết quả sau khi kiểm tra',
    title: 2
  },
  {
    name: 'Xem lịch sử chỉnh sửa thông tin',
    title: 2
  }
]

const loading = ref(false)
const addUserFormRef = ref()
const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)

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
    <h2 class="mb-2">Danh sách chức năng được truy cập theo role</h2>
    <el-table :data="tableData" border class="fixed-table w-full overflow-y-auto">
      <el-table-column prop="name" label="Tên chức năng">
        <template #default="scope">
          <div v-if="scope.row.title == 1" class="text-[#495057] font-bold">
            {{ scope.row.name }}
          </div>
          <div v-if="scope.row.title == 2" class="flex flex-row gap-2 items-center">
            <div class="h-1 w-1 rounded-sm bg-[#495057]" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="Admin" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" disabled v-model="checked1" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="Checker" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" disabled v-model="checked2" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maker" label="Maker" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" disabled v-model="checked3" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="viewer" label="Viewer" align="center" width="90">
        <template #default="scope">
          <div class="text-center">
            <el-checkbox
              size="large"
              disabled
              v-model="checked4"
              v-if="
                scope.$index != 3 && scope.$index != 4 && scope.$index != 5 && scope.$index != 8 && scope.$index != 9
              "
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>
