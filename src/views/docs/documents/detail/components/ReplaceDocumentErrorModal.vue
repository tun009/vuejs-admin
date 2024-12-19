<script setup lang="ts">
import { ReplaceDocumentClassifyErrordModel } from '@/@types/pages/docs/documents'
import { replaceDocumentErrorFile } from '@/api/docs/document'
import EIBUpload from '@/components/common/EIBUpload.vue'
import { warningNotification } from '@/utils/notification'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
interface Props {
  modelValue: boolean
  dossierDocId: number | string
  batchId: number | string
  title?: string
}
const { t } = useI18n()

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'refresh'): void
  (event: 'update-file-replace', data: ReplaceDocumentClassifyErrordModel): void
}
const props = defineProps<Props>()
const titleWithDefault = props.title || t('docs.document.replaceDocument')
const emits = defineEmits<Emits>()

const files = ref<File[]>([])
const loading = ref(false)

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

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})
const handleAddDocument = async () => {
  if (!files.value.length) {
    warningNotification(t('notification.description.emptyFiles'))
    return
  }
  const formData = new FormData()
  for (const file of files.value) {
    formData.append('file', file)
  }
  const { data } = await replaceDocumentErrorFile(formData, props.batchId, 'LETTER_OF_CREDIT')
  ElMessage({
    message: 'Thay thế chứng từ thành công',
    showClose: true,
    type: 'success'
  })
  emits('update-file-replace', data)
  localModelValue.value = false
}
</script>

<template>
  <el-dialog v-model="localModelValue" :title="titleWithDefault" width="50%" :before-close="handleClose">
    <template #footer>
      <div class="dialog-footer flex flex-row justify-between items-center">
        <span class="text-sm text-gray-600">{{ $t('docs.document.uploadNoteSingle') }}</span>
        <div>
          <el-button @click="localModelValue = false">{{ $t('button.cancel') }}</el-button>
          <el-button :loading="loading" type="primary" @click="handleAddDocument">
            {{ $t('button.confirm') }}
          </el-button>
        </div>
      </div>
    </template>
    <EIBUpload :files="files" @add-files="addFiles" @set-files="setFiles" :limit-file-count="1" v-loading="loading" />
  </el-dialog>
</template>
