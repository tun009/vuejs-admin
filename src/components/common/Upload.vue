<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { uploadDocumentColumnConfig } from '@/@types/common'
import { MAX_FILE_LIMIT, MAX_FILE_SIZE } from '@/constants/common'
import { truncateFileName } from '@/utils/common'
import { warningNotification } from '@/utils/notification'
import { Delete, Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import Table from './Table.vue'

interface Props {
  files: File[]
}

interface Emits {
  (e: 'add-files', value: FileList): void
  (e: 'set-files', value: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
  files: () => []
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
  Array.from(fileList).forEach((item) => {
    if (item.size > MAX_FILE_SIZE) {
      isInvalidFileSize = true
    }
  })
  if (isInvalidFileSize) {
    warningNotification(t('notification.description.limitSize'))
    return
  }
  if (props.files.length + fileList.length > MAX_FILE_LIMIT) {
    warningNotification(t('notification.description.limitQuantity'))
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
      <input type="file" @change="onFileChange" multiple hidden ref="fileInput" />
      <el-button @click="selectFiles" class="w-fit min-w-96" type="primary" plain :icon="Plus">{{
        $t('docs.document.selectFromDevice')
      }}</el-button>
      <p class="absolute bottom-6">{{ $t('docs.document.validFormat') }}</p>
    </div>
    <div v-if="files.length" class="flex-[2] flex flex-col gap-y-2 overflow-x-auto">
      <p>{{ $t('docs.document.uploadList') }}</p>
      <Table
        :column-configs="uploadDocumentColumnConfig"
        :data="tableFiles"
        hiddenPagination
        hiddenChecked
        height="350"
        locales
      >
        <template #actions="{ index }">
          <el-icon :size="18" color="#e03131" class="cursor-pointer" @click="() => handleDeleteFile(index)"
            ><Delete
          /></el-icon>
        </template>
      </Table>
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
