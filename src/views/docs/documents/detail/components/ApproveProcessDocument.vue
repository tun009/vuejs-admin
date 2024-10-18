<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

import { ApproveProcessDocumentModel, approveProcessDocumentColumnConfigs } from '@/@types/pages/docs/documents'
import { getCheckers } from '@/api/docs/document'
import EIBTable from '@/components/common/EIBTable.vue'
import { warningNotification } from '@/utils/notification'

interface Emits {
  (event: 'close'): void
  (event: 'success'): void
}

interface Exposes {
  handleClose: () => void
}

const emits = defineEmits<Emits>()

const radio = ref()
const loading = ref(false)
const tableData = ref<ApproveProcessDocumentModel[]>([])
const checkerTableRef = ref<InstanceType<typeof EIBTable>>()

const handleGetChecker = async () => {
  try {
    checkerTableRef.value?.setLoading(true)
    const response = await getCheckers()
    if (response?.data?.list) {
      tableData.value = response?.data?.list
    }
  } catch (error) {
    console.error(error)
  } finally {
    checkerTableRef.value?.setLoading(false)
  }
}

const handleClose = () => {
  emits('close')
}

const handleSelectChecker = () => {
  if (!radio.value) {
    warningNotification('Vui lòng chọn checker')
    return
  }
  loading.value = true
  setTimeout(() => {
    ElMessage.success('Checker được chọn: ' + radio.value.toString())
    loading.value = false
    radio.value = undefined
    emits('success')
    handleClose()
  }, 2000)
}

onMounted(() => {
  handleGetChecker()
})

defineExpose<Exposes>({
  handleClose
})
</script>

<template>
  <div class="flex flex-col gap-5">
    <span>Danh sách checker</span>
    <el-radio-group v-model="radio" class="w-full">
      <EIBTable
        ref="checkerTableRef"
        locales
        hiddenChecked
        hiddenPagination
        :columnConfigs="approveProcessDocumentColumnConfigs"
        :data="tableData"
      >
        <template #stt="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template #select="{ row }">
          <el-radio :value="row.id" />
        </template>
        <template #checker="{ row }">
          <div>
            <span>{{ row.name }}</span>
            <br />
            <span class="!text-blue-500">{{ row.username }}</span>
          </div>
        </template>
      </EIBTable>
    </el-radio-group>
  </div>
  <div>
    <span class="underline">Lưu ý:</span
    ><span>
      sau khi trình checker thì Hệ thống sẽ ghi nhận bạn đã hoàn tất việc kiểm tra bộ chứng từ, chuyển sang trạng thái
      “Chờ phê duyệt” và bạn không thể chỉnh sửa được nữa</span
    >
  </div>
  <div>
    <el-button :loading="loading" @click.prevent="handleSelectChecker" type="primary">{{
      $t('button.update')
    }}</el-button>
    <el-button :disabled="loading" @click="handleClose" type="default">{{ $t('button.cancel') }}</el-button>
  </div>
</template>
