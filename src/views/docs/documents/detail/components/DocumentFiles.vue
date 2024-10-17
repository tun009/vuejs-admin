<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import EIBUpload from '@/components/common/EIBUpload.vue'
import { warningNotification } from '@/utils/notification'
import { DocumentFileModel, fileListColumnConfigs } from '@/@types/pages/docs/documents'
import { getDocumentFiles } from '@/api/docs/document'
import EIBTable from '@/components/common/EIBTable.vue'

const { t } = useI18n()

const dialogVisible = ref<boolean>(false)
const loading = ref<boolean>(false)
const files = ref<File[]>([])
const tableData = ref<DocumentFileModel[]>([])
const fileListTableRef = ref<InstanceType<typeof EIBTable>>()

const addFiles = (fileList: FileList) => {
  files.value.push(...Array.from(fileList))
}

const setFiles = (fileList: File[]) => {
  files.value = fileList
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm(t('notification.description.confirmClose'))
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const handleAddDocument = () => {
  loading.value = true
  if (!files.value.length) {
    warningNotification(t('notification.description.emptyFiles'))
    return
  }

  const formData = new FormData()
  for (const file of files.value) {
    formData.append('files', file)
  }

  // call api upload

  setTimeout(() => {
    loading.value = false
    ElMessage({
      message: t('notification.description.createSuccess'),
      showClose: true,
      type: 'success'
    })
    dialogVisible.value = false
  }, 2000)
}

const handleGetDocumentFiles = async () => {
  try {
    fileListTableRef.value?.setLoading(true)
    const response = await getDocumentFiles()
    if (response?.data?.list) {
      tableData.value = response?.data?.list
    }
  } catch (error) {
    console.error(error)
  } finally {
    fileListTableRef.value?.setLoading(false)
  }
}

onMounted(() => {
  handleGetDocumentFiles()
})

const handleDeleteFile = (id: number | string) => {
  const newFiles = tableData.value.filter((_i) => _i.id !== id)
  tableData.value = newFiles
}
</script>

<template>
  <el-card>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row justify-end">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
      <!-- add file dialog -->
      <el-dialog v-model="dialogVisible" :title="$t('docs.document.addFile')" width="75%" :before-close="handleClose">
        <EIBUpload :files="files" @add-files="addFiles" @set-files="setFiles" />
        <template #footer>
          <div class="dialog-footer flex flex-row justify-between items-center">
            <span class="text-sm text-gray-600">{{ $t('docs.document.uploadNote') }}</span>
            <div>
              <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
              <el-button :loading="loading" type="primary" @click="handleAddDocument">
                {{ $t('button.confirm') }}
              </el-button>
            </div>
          </div>
        </template>
      </el-dialog>
      <EIBTable
        ref="fileListTableRef"
        locales
        hidden-pagination
        hidden-checked
        :columnConfigs="fileListColumnConfigs"
        :data="tableData"
      >
        <template #actions="{ row }">
          <div class="flex flex-row gap-2">
            <el-icon :size="18" color="#e03131" class="cursor-pointer" @click="handleDeleteFile(row.id)"
              ><Delete
            /></el-icon>
          </div>
        </template>
        <template #stt="{ index }">
          <span>{{ index + 1 }}</span>
        </template></EIBTable
      >
    </div>
  </el-card>
</template>
