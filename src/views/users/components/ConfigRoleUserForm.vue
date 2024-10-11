<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
const loading = ref(false)
const addUserFormRef = ref()

const handleAddUser = () => {
  addUserFormRef.value?.validate((valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage({
          message: t('notification.description.createSuccess'),
          showClose: true,
          type: 'success'
        })
        handleClose()
      }, 5000)
    } else {
      console.error('Form validation failed', fields)
    }
  })
}

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
          <div v-if="scope.row.title == 1" class="text-[#495057] font-bold">{{ scope.row.name }}</div>
          <div v-if="scope.row.title == 2" class="flex flex-row gap-2 items-center">
            <div class="h-1 w-1 rounded-sm bg-[#495057]" />
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="Admin" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="Checker" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="maker" label="Maker" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="viewer" label="Viewer" align="center" width="90">
        <template #default>
          <div class="text-center">
            <el-checkbox size="large" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-button :loading="loading" @click.prevent="handleAddUser" type="primary">Hoàn tất</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-table tr th) {
  background-color: #005d98 !important;
  color: white;
}
</style>
