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
  hiddenSelection?: boolean
}

interface Emits {
  (event: 'update:selection', value: any[]): void
  (event: 'row-click', row: any): void
}

interface Exposes {
  clearSelection: () => void
  setLoading: (status: boolean) => void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const totalItems = ref<number>(0)
const loading = ref<boolean>(false)

const pagination = ref<PaginationModel>({
  pageNum: 0,
  pageSize: 10
})

const multipleTableRef = ref<TableInstance>()

const selectable = (row: any) => !(props.disabledIds ?? []).includes(row.id)
const handleSelectionChange = (val: any[]) => {
  emits('update:selection', val)
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

const handlePageChange = (newPage: number) => {
  pagination.value.pageNum = newPage - 1
  handleGetData()
}

const handlePageSizeChange = (newPageSize: number) => {
  pagination.value.pageSize = newPageSize
  pagination.value.pageNum = 0 // Reset to first page on size change
  handleGetData()
}

const handleClearSelection = () => {
  multipleTableRef.value?.clearSelection()
}

const setLoading = (status: boolean) => {
  loading.value = status
}

onMounted(async () => {
  handleGetData()
})

defineExpose<Exposes>({
  clearSelection: handleClearSelection,
  setLoading
})
</script>

<template>
  <div class="flex flex-col gap-5 w-full eib-table">
    <el-table
      ref="multipleTableRef"
      border
      v-loading="loading"
      :data="data"
      lazy
      style="width: 100%; overflow-y: auto"
      :height="height === 'unset' ? undefined : (height ?? 600)"
      class="custom-table hidden-scrollbar"
      @selection-change="handleSelectionChange"
      @row-click="(row) => $emit('row-click', row)"
    >
      <caption>
        Design by Viettel IDP
      </caption>
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
        <template v-if="!column?.columns" v-slot:default="scope">
          <slot :name="column.field" :column="column" :row="scope.row" :index="scope.$index" class="cursor-pointer">
            <div v-if="column?.html" v-html="scope.row[column.field]" />
            <span v-else>{{ scope.row[column.field] }}</span>
          </slot>
        </template>
        <template v-if="!!column?.columns">
          <el-table-column
            v-for="columnChil in column?.columns"
            :min-width="columnChil?.minWidth"
            :width="columnChil?.width"
            :fixed="columnChil.field === 'actions' ? 'right' : false"
            :key="columnChil.field"
            :prop="columnChil.field"
            :label="locales ? $t(columnChil.label) : columnChil.label"
          >
            <template v-slot:default="scope">
              <slot
                :name="columnChil.field"
                :columnChil="columnChil"
                :row="scope.row"
                :index="scope.$index"
                class="cursor-pointer"
              >
                <div v-if="columnChil?.html" v-html="scope.row[columnChil.field]" />
                <span v-else>{{ scope.row[columnChil.field] }}</span>
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex flex-col justify-center gap-2 items-center leading-8 text-[#495057]">
          <SvgIcon name="empty-data" class="!h-12 !w-12" />
          <p>Không có dữ liệu</p>
          <p>Hãy bắt đầu sử dụng, bằng việc click vào nút <strong>Thêm</strong> để có thể thêm bộ chứng từ bạn cần</p>
        </div>
      </template>
    </el-table>

    <el-pagination
      v-if="!hiddenPagination"
      background
      :current-page="pagination.pageNum + 1"
      :page-size="pagination.pageSize"
      :page-sizes="PAGE_SIZE_LIST_DEFAULT"
      :total="totalItems"
      layout="sizes, slot, ->, prev, pager, next"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    >
      <template #default>
        <span class="el-pagination__total-text ml-5">
          <span class="text-[#868e96]">{{ $t('base.table.showing') }}</span>
          {{ pagination.pageNum * pagination.pageSize + 1 }} <span class="text-[#868e96]">-</span>
          {{ Math.min((pagination.pageNum + 1) * pagination.pageSize, totalItems) }} / {{ totalItems }}
          <span class="text-[#868e96]">{{ $t('base.table.results') }}</span>
        </span>
      </template>
    </el-pagination>
  </div>
</template>

<style lang="css">
.el-table tr th {
  background-color: #005d98 !important;
  color: white;
}

.text-total-records {
  color: #005d98;
}

.el-checkbox.is-checked,
.el-checkbox__input.is-indeterminate {
  border: 1px solid #fff;
}
</style>

<style lang="css" scoped>
.custom-table {
  transition: height 0.4s;
}
</style>
