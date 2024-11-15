<script setup lang="ts">
import { ExtractResultOcrTableChildrenModel, ExtractResultOcrTableHeaderModel } from '@/@types/pages/extract'
import { ref } from 'vue'
interface ExtractPdfViewExpose {
  tagLabelToPage: (boxInfo: number[], pageNum: number) => void
}
const props = defineProps<{
  header: ExtractResultOcrTableHeaderModel[]
  body: ExtractResultOcrTableChildrenModel[][]
  pdfViewRef: ExtractPdfViewExpose | null
}>()
const editingRows = ref<Record<string, boolean>>({})
const isEditing = (rowIndex: number, colIndex: number) => {
  return editingRows.value[`${rowIndex}-${colIndex}`]
}
const toggleEdit = (rowIndex: number, colIndex: number, dataCol: ExtractResultOcrTableChildrenModel) => {
  if (editingRows.value) editingRows.value = {}
  isEditing(rowIndex, colIndex)
  const key = `${rowIndex}-${colIndex}`
  editingRows.value[key] = !isEditing(rowIndex, colIndex)
  if (props.pdfViewRef) {
    props.pdfViewRef.tagLabelToPage(dataCol.bboxes, dataCol.pageId)
  }
}
</script>
<template>
  <table class="table table-structured-cp">
    <thead>
      <td>STT</td>
      <th v-for="(header, index_header) in props.header" :key="index_header">
        {{ header.name }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(data_row, index_row) in props.body" :key="index_row">
        <td class="text-center">{{ index_row + 1 }}</td>
        <td v-for="(data_col, index_col) in data_row" :key="index_col">
          <el-input
            v-if="isEditing(index_row, index_col)"
            v-model="data_col.extractionValue"
            :class="{
              'no-content': data_col?.confidence == 0
            }"
            type="textarea"
            autosize
            spellcheck="false"
          />
          <div
            v-else
            class="cursor-pointer min-h-[25px] w-full break-words"
            @click="toggleEdit(index_row, index_col, data_col)"
          >
            {{ data_col?.extractionValue }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style lang="css" scoped>
table,
td,
th {
  border: 1px solid #adb5bd;
  padding: 6px;
  vertical-align: middle;
}

table {
  width: 100%;
  border-collapse: collapse;
}
</style>
<style>
.table-structured-cp .el-textarea__inner {
  min-height: 25px !important;
  overflow: hidden;
  padding: 5px !important;
  resize: none;
}
</style>
