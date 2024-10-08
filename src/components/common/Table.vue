<template>
  <div class="flex flex-col gap-5">
    <el-table
      ref="multipleTableRef"
      border
      v-loading="loading"
      :data="data"
      lazy
      style="width: 100%; overflow-y: auto"
      :height="height === 'unset' ? undefined : (height ?? 600)"
      class="fixed-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="!hiddenChecked" fixed type="selection" :selectable="selectable" width="40" />
      <el-table-column
        v-for="column in columnConfigs"
        :min-width="column?.minWidth"
        :width="column?.width"
        :fixed="column.field === 'actions' ? 'right' : false"
        :key="column.field"
        :prop="column.field"
        :label="locales ? $t(column.label) : column.label"
      >
        <template v-slot:default="scope">
          <slot :name="column.field" :column="column" :row="scope.row" :index="scope.$index">
            <span>{{ scope.row[column.field] }}</span>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="!hiddenPagination"
      background
      :current-page="pagination.pageNum + 1"
      :page-size="pagination.pageSize"
      :page-sizes="PAGE_SIZE_LIST_DEFAULT"
      :total="totalItems"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TableInstance } from 'element-plus'
import { ColumnConfigModel, PaginationModel } from '@/@types/common'
import { PAGE_SIZE_LIST_DEFAULT } from '@/constants/common'

interface Props {
  hiddenChecked?: boolean
  data?: any[]
  callback?: (params: PaginationModel) => Promise<any>
  hiddenPagination?: boolean
  columnConfigs?: ColumnConfigModel[]
  disabledIds?: (string | number)[]
  height?: number | string | 'unset'
  locales?: boolean
}
const props = defineProps<Props>()
const totalItems = ref<number>(0)
const loading = ref<boolean>(false)

const pagination = ref<PaginationModel>({
  pageNum: 0,
  pageSize: 10
})

const multipleTableRef = ref<TableInstance>()
const multipleSelection = ref([])

const selectable = (row: any) => !(props.disabledIds ?? []).includes(row.id)
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const handlePageChange = (newPage: number) => {
  pagination.value.pageNum = newPage - 1
  handleGetData()
}

const handleGetData = async () => {
  try {
    if (!props.callback) return
    loading.value = true
    const response = await props.callback(pagination.value)
    if (response?.data?.total) {
      totalItems.value = response.data.total
    }
  } catch (error: any) {
    throw new Error(error)
  } finally {
    loading.value = false
  }
}

const handlePageSizeChange = (newPageSize: number) => {
  pagination.value.pageSize = newPageSize
  pagination.value.pageNum = 0 // Reset to first page on size change
  handleGetData()
}

onMounted(async () => {
  handleGetData()
})
</script>

<style lang="css" scoped>
:deep(.el-table tr th) {
  background-color: #005d98 !important;
  color: white;
}

:deep(.text-total-records) {
  color: #005d98;
}

:deep(.el-checkbox.is-checked),
:deep(.el-checkbox__input.is-indeterminate) {
  border: 1px solid #fff;
}
</style>
