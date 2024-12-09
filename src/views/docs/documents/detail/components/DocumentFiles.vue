<script lang="ts" setup>
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import EIBUpload from '@/components/common/EIBUpload.vue'
import { warningNotification } from '@/utils/notification'
import {
  DocumentExportFileEnum,
  DocumentFileModel,
  documentStatusOptions,
  fileListColumnConfigs
} from '@/@types/pages/docs/documents'
import { addFileToDocument, deleteDocumentFile, downloadSingleFile, getDocumentFiles } from '@/api/docs/document'
import EIBTable from '@/components/common/EIBTable.vue'
import { useRoute } from 'vue-router'
import Status from '@/views/docs/components/Status.vue'
import { formatDate } from '@/utils/date'
import { formatDDMMYYYY_HHMM } from '@/constants/date'
import { DocumentStatusEnum } from '@/@types/common'
import { useConfirmModal } from '@/hooks/useConfirm'
import { downloadFileCommon } from '@/utils/common'

const { t } = useI18n()
const route = useRoute()
const { showConfirmModal } = useConfirmModal()

const batchId = computed(() => route.params?.id as string)

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

const handleAddDocument = async () => {
  try {
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
    await addFileToDocument(batchId.value, formData)
    ElMessage({
      message: t('notification.description.createSuccess'),
      showClose: true,
      type: 'success'
    })
    files.value = []
    dialogVisible.value = false
    handleGetDocumentFiles()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleGetDocumentFiles = async () => {
  try {
    fileListTableRef.value?.setLoading(true)
    const response = await getDocumentFiles({ batchId: batchId.value })
    if (response?.data) {
      tableData.value = response?.data
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

const handleDeleteFile = async (row: DocumentFileModel) => {
  showConfirmModal({
    title: t('confirm.title.deleteFile'),
    message: t('confirm.description.deleteFile', { name: row.fileName }),
    onConfirm: async (instance, done) => {
      try {
        await deleteDocumentFile(row.id)
        const newFiles = tableData.value.filter((_i) => _i.id !== row.id)
        tableData.value = newFiles
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    }
  })
}

const handleDownloadFile = async (src: string) => {
  try {
    const response = await downloadSingleFile({ src })
    downloadFileCommon(response, DocumentExportFileEnum.PDF)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <el-card>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row justify-end">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
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
        <template #status="{ row }">
          <Status :options="documentStatusOptions" :status="row.status" />
        </template>
        <template #fileName="{ row }">
          <div @click.stop="handleDownloadFile(row.filePath)">{{ row.fileName }}</div>
        </template>
        <template #createdAt="{ row }">
          <span>{{ formatDate(row.createdAt, formatDDMMYYYY_HHMM) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2">
            <el-icon
              v-if="row.status === DocumentStatusEnum.NEW"
              :size="18"
              color="#e03131"
              class="cursor-pointer"
              @click="handleDeleteFile(row)"
              ><Delete
            /></el-icon>
          </div> </template
      ></EIBTable>
    </div>
  </el-card>
</template>
