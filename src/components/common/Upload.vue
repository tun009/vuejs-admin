<template>
  <div class="flex flex-col lg:flex-row gap-4">
    <div
      class="dropzone flex flex-[3] flex-col gap-y-3 justify-center items-center min-h-96 relative bg-[#f8f9fa] dark:bg-transparent"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
      :class="{ 'is-dragover': isDragOver }"
    >
      <p>Kéo và thả file vào đây</p>
      <p>hoặc</p>
      <input type="file" @change="onFileChange" multiple hidden ref="fileInput" />
      <el-button @click="selectFiles" class="w-fit min-w-96" type="primary" plain :icon="Plus"
        >Chọn từ máy tính</el-button
      >
      <p class="absolute bottom-6">Các dạng file hỗ trợ: PDF, JPEG, JPG, PNG</p>
    </div>
    <div v-if="files.length" class="flex-[2] flex flex-col gap-y-2 overflow-x-auto">
      <p>Danh sách file upload</p>
      <Table
        :column-configs="uploadDocumentColumnConfig"
        :data="tableFiles"
        hiddenPagination
        hiddenChecked
        height="350"
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

<script setup lang="ts">
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

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDragOver = () => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
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

const addFiles = (fileList: FileList) => {
  let isInvalidFileSize = false
  Array.from(fileList).forEach((item) => {
    if (item.size > MAX_FILE_SIZE) {
      isInvalidFileSize = true
    }
  })
  if (isInvalidFileSize) {
    warningNotification('Dung lượng file không vượt quá 16MB!')
    return
  }
  if (props.files.length + fileList.length > MAX_FILE_LIMIT) {
    warningNotification('Tổng số file không vượt quá 10!')
    return
  }
  emits('add-files', fileList)
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

<style scoped>
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
