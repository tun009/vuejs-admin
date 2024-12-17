<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { DocumentStatusEnum } from '@/@types/common'
import {
  DocumentExportFileEnum,
  DocumentFileModel,
  documentStatusOptions,
  fileListColumnConfigs
} from '@/@types/pages/docs/documents'
import { BatchDetailModel } from '@/@types/pages/docs/documents/services/DocumentResponse'
import { addFileToDocument, deleteDocumentFile, downloadSingleFile, getDocumentFiles } from '@/api/docs/document'
import EIBTable from '@/components/common/EIBTable.vue'
import EIBUpload from '@/components/common/EIBUpload.vue'
import {
  checkerStepDocumentStatus,
  deleteAccessStatus,
  endedDocumentStatus,
  makerStepDocumentStatus,
  statusAccessDeleteDocumentStatus
} from '@/constants/common'
import { formatDDMMYYYY_HHMM } from '@/constants/date'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useUserStore } from '@/store/modules/user'
import { downloadFileCommon } from '@/utils/common'
import { formatDate } from '@/utils/date'
import { errorNotification, warningNotification } from '@/utils/notification'
import Status from '@/views/docs/components/Status.vue'
import { useRoute } from 'vue-router'

interface Props {
  data: BatchDetailModel
}

interface Emits {
  (event: 'refresh'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { t } = useI18n()
const route = useRoute()
const { showConfirmModal } = useConfirmModal()
const { isMaker, isViewer, isAdmin, isChecker, userInfo } = useUserStore()

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
    emits('refresh')
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
  if (!deleteAccessStatus.includes(row?.status)) {
    errorNotification('Không thể xóa chứng từ, hệ thống đang thực hiện xử lý!')
    return
  }
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
    },
    options: {
      confirmButtonText: 'Xác nhận xóa'
    },
    isDelete: true
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

const isHaveAddButton = computed(() => {
  if (isViewer) return false
  const isClassificationErrorByCreator =
    props.data.status === DocumentStatusEnum.CLASSIFICATION_ERROR &&
    userInfo.username === props.data.createdBy?.username

  const isMakerEligible = isMaker && makerStepDocumentStatus.includes(props.data.status)

  const isCheckerOrAdminEligible =
    (isAdmin &&
      [...makerStepDocumentStatus, ...checkerStepDocumentStatus, DocumentStatusEnum.CLASSIFICATION_ERROR].includes(
        props.data.status
      )) ||
    (isChecker &&
      checkerStepDocumentStatus.includes(props.data.status) &&
      (userInfo.username === props.data.createdBy?.username || userInfo.username === props.data.approveBy?.username))

  return isClassificationErrorByCreator || isMakerEligible || isCheckerOrAdminEligible
})

const isHaveDeleteFile = (username: string, status: DocumentStatusEnum) => {
  if (endedDocumentStatus.includes(status)) return false
  if (!statusAccessDeleteDocumentStatus.includes(status)) return false
  if (isAdmin || isMaker) return true
  if (isChecker && username === userInfo.username) return true
  return false
}
</script>

<template>
  <el-card>
    <div class="flex flex-col gap-4">
      <div v-if="isHaveAddButton" class="flex flex-row justify-end">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
      <el-dialog v-model="dialogVisible" :title="$t('docs.document.addFile')" width="60%" :before-close="handleClose">
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
          <div class="flex flex-row gap-2 justify-center">
            <div class="w-5 h-5">
              <SvgIcon
                v-if="isHaveDeleteFile(row?.createdBy?.username, row.status)"
                :size="20"
                name="delete-mini"
                @click.stop="handleDeleteFile(row)"
                class="cursor-pointer"
              />
            </div>
          </div> </template
      ></EIBTable>
    </div>
  </el-card>
</template>
