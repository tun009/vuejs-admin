<script setup lang="ts">
import { replaceDocument } from '@/api/extract'
import EIBUpload from '@/components/common/EIBUpload.vue'
import { warningNotification } from '@/utils/notification'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
interface Props {
  modelValue: boolean
  dossierDocId: number
  title?: string
}
const { t } = useI18n()

interface Emits {
  (event: 'update:model-value', value: boolean): void
  (event: 'refresh'): void
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
  loading.value = true
  if (!files.value.length) {
    warningNotification(t('notification.description.emptyFiles'))
    return
  }

  const formData = new FormData()
  for (const file of files.value) {
    formData.append('file', file)
  }

  await replaceDocument(formData, props.dossierDocId)
  ElMessage({
    message: 'Thay thế chứng từ thành công',
    showClose: true,
    type: 'success'
  })
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
    <EIBUpload :files="files" @add-files="addFiles" @set-files="setFiles" :limit-file-count="1" />
  </el-dialog>
</template>
