<script setup lang="ts">
import {
  ExtractResultOcrPageBBboxesModel,
  ExtractResultOcrTableChildrenModel,
  ExtractResultOcrTableHeaderModel
} from '@/@types/pages/extract'
import { computed, nextTick, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
interface ExtractPdfViewExpose {
  tagLabelToPage: (
    boxInfo: ExtractResultOcrPageBBboxesModel[],
    type: 'list[text]' | 'text' | 'image' | 'structured_table'
  ) => void
}
const props = defineProps<{
  header: ExtractResultOcrTableHeaderModel[]
  body: ExtractResultOcrTableChildrenModel[][]
  pdfViewRef: ExtractPdfViewExpose | null
  disabled: boolean
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
    props.pdfViewRef.tagLabelToPage(dataCol?.pageBboxes ?? [], dataCol.type)
  }
}
const decreaseRow = (index: number) => {
  const updatedBody = props.body
  updatedBody.splice(index, 1)
  // emit('update-body', data)
}
const addNewData = () => {
  const tempValueAdd = props.header.map((item) => ({
    coreKey: item.key,
    type: 'text',
    validatedValue: ''
  })) as ExtractResultOcrTableChildrenModel[]
  const updatedBody = props.body
  updatedBody.splice(1, 0, tempValueAdd)
}
const increaseRow = (index: number, row: ExtractResultOcrTableChildrenModel[]) => {
  const tempValue = row.map((item) => ({
    coreKey: item.coreKey,
    type: item.type,
    validatedValue: ''
  })) as ExtractResultOcrTableChildrenModel[]
  const updatedBody = props.body

  updatedBody.splice(index + 1, 0, tempValue)
  nextTick(() => {
    const newRow = document.getElementById(`row-${index + 1}`)
    if (newRow) {
      newRow.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  })
}
const bodyTable = computed(() => {
  const bodyConvert: ExtractResultOcrTableChildrenModel[][] = []
  props.body.forEach((rowBody) => {
    const result: ExtractResultOcrTableChildrenModel[] = []
    props.header.forEach((headerItem) => {
      const matchedItem = rowBody.find((bodyItem) => bodyItem.coreKey === headerItem.key)

      if (matchedItem) {
        result.push(matchedItem)
      }
    })
    bodyConvert.push(result)
  })
  return bodyConvert
})
</script>
<template>
  <table class="table table-structured-cp" :class="{ 'table-fixed': props.header.length < 5 }">
    <caption class="hidden">
      To display table structured
    </caption>
    <thead>
      <tr>
        <th class="w-[100px]">STT</th>
        <th v-for="(header, index_header) in props.header" :key="index_header">
          {{ header.name }}
        </th>
        <th class="w-[120px]" v-if="bodyTable.length > 0" />
      </tr>
    </thead>
    <tbody>
      <tr v-if="bodyTable.length === 0">
        <td :colspan="props.header.length + 1" class="h-[120px]">
          <el-button
            @click="addNewData()"
            class="sticky left-1/2 inline-block -translate-x-1/2"
            type="primary"
            :icon="Plus"
            >Thêm dữ liệu</el-button
          >
        </td>
      </tr>
      <tr v-else v-for="(data_row, index_row) in bodyTable" :key="index_row" :id="`row-${index_row}`">
        <td class="text-center">{{ index_row + 1 }}</td>
        <td v-for="(data_col, index_col) in data_row" :key="index_col">
          <el-input
            v-if="isEditing(index_row, index_col)"
            v-model="data_col.validatedValue"
            :class="{
              'no-content': data_col?.confidence === 0
            }"
            type="textarea"
            autosize
            spellcheck="false"
            :disabled="disabled"
          />
          <div
            v-else
            class="cursor-pointer min-h-[25px] w-full break-words"
            @click="toggleEdit(index_row, index_col, data_col)"
          >
            {{ data_col?.validatedValue }}
          </div>
        </td>
        <td>
          <div class="flex flex-row gap-3 items-center px-3 justify-center">
            <el-icon :size="20" class="cursor-pointer" title="Thêm hàng" @click="increaseRow(index_row, data_row)"
              ><CirclePlus
            /></el-icon>
            <SvgIcon
              :size="20"
              name="delete-mini"
              class="cursor-pointer"
              title="Xóa hàng"
              @click="decreaseRow(index_row)"
            />
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
