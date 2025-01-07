<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { uploadDocumentColumnConfig } from '@/@types/common'
import { MAX_FILE_LIMIT, MAX_FILE_SIZE } from '@/constants/common'
import { truncateFileName } from '@/utils/common'
import { warningNotification } from '@/utils/notification'
import { Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import EIBTable from './EIBTable.vue'

interface Props {
  files: File[]
  limitFileCount?: number
  allowedExtensions?: string
  isReplaceFile?: boolean
}

interface Emits {
  (e: 'add-files', value: FileList): void
  (e: 'set-files', value: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
  files: () => [],
  limitFileCount: MAX_FILE_LIMIT,
  allowedExtensions: 'application/pdf,image/jpeg,image/png'
})

const emits = defineEmits<Emits>()

const { t } = useI18n()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const addFiles = (fileList: FileList) => {
  let isInvalidFileSize = false
  const isInvalidFormat = Array.from(fileList).some((item) => {
    return !props.allowedExtensions.includes(item.type)
  })
  if (isInvalidFormat) {
    warningNotification(t('notification.description.invalidFormat'))
    return
  }
  Array.from(fileList).forEach((item) => {
    if (item.size > MAX_FILE_SIZE) {
      isInvalidFileSize = true
    }
  })
  if (isInvalidFileSize) {
    warningNotification(t('notification.description.limitSize'))
    return
  }
  if (props.files.length + fileList.length > props.limitFileCount) {
    warningNotification(t('notification.description.limitQuantity', { count: props.limitFileCount }))
    return
  }
  emits('add-files', fileList)
}

const onDrop = (event: DragEvent) => {
  isDragOver.value = false
  const droppedFiles = event.dataTransfer?.files
  if (droppedFiles) {
    addFiles(droppedFiles)
  }
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(input.files)
    if (!fileInput.value) return
    fileInput.value.value = ''
  }
}

const selectFiles = () => {
  fileInput.value?.click()
}

const tableFiles = computed(() => {
  const dataTable = []
  let stt = 1
  for (const file of props.files) {
    const fileName = truncateFileName(file.name)
    dataTable.push({
      stt,
      fileName,
      size: file.size
    })
    stt++
  }
  return dataTable
})

const handleDeleteFile = (index: number) => {
  const newFiles = props.files.filter((_i, idx) => idx !== index)
  emits('set-files', newFiles)
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <div
      class="dropzone flex flex-[3] flex-col gap-y-3 justify-center items-center min-h-96 relative bg-[#f8f9fa] dark:bg-transparent"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'is-dragover': isDragOver }"
    >
      <p>{{ $t('docs.document.dragDrop') }}</p>
      <p>{{ $t('docs.document.or') }}</p>
      <input type="file" @change="onFileChange" multiple hidden ref="fileInput" :accept="props.allowedExtensions" />
      <el-button @click="selectFiles" class="w-fit min-w-96" type="primary" plain :icon="Plus">{{
        $t('docs.document.selectFromDevice')
      }}</el-button>
      <p class="absolute bottom-6">{{ $t('docs.document.validFormat') }}</p>
    </div>
    <div v-if="files.length" class="flex-[2] flex flex-col gap-y-2 overflow-x-auto">
      <p>{{ $t('docs.document.uploadList') }}</p>
      <EIBTable
        :column-configs="uploadDocumentColumnConfig"
        :data="tableFiles"
        hiddenPagination
        hiddenChecked
        :height="isReplaceFile ? 'auto' : 350"
        locales
      >
        <template #actions="{ index }">
          <div class="flex flex-row gap-2 justify-center">
            <div class="w-5 h-5">
              <SvgIcon @click="() => handleDeleteFile(index)" :size="20" name="delete-mini" class="cursor-pointer" />
            </div>
          </div>
        </template>
      </EIBTable>
      <div v-if="isReplaceFile" class="c-text-des italic">
        Sau khi bấm Tải lên, hệ thống sẽ tự động thực hiện Phân loại, Trích xuất và Đối sánh lại thông tin theo nội dung
        chứng từ mới nhất
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.dropzone {
  border: 1px dashed #343a40;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.5s;
}

.dropzone.is-dragover {
  border-color: #007bff;
  background-color: #d9ecff;
}
</style>
