<script lang="ts" setup>
import { ArrowDownBold, Delete, Filter, Plus, Search } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import UploadDocuments from '../components/UploadDocuments.vue'
import UpdateDocument from './components/UpdateDocument.vue'

import { PaginationModel } from '@/@types/common'
import {
  DocumentModel,
  FilterDocumentModel,
  businessTypeOptions,
  docListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  processingStepOptions
} from '@/@types/pages/docs/documents'
import { getDocuments } from '@/api/docs/document'
import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { formatYYYYMMDD, formatYYYYMMDD_HHMM, shortcutsDateRange } from '@/constants/date'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { Title } from '@/layouts/components'
import { MOCK_SOLS } from '@/mocks/user'
import { omitPropertyFromObject, renderLabelByValue, withAllSelection } from '@/utils/common'
import { defaultDateRange, formatDate } from '@/utils/date'

const { t } = useI18n()
const router = useRouter()
const { showConfirmModal } = useConfirmModal()

const openFilter = ref(false)
const tableData = ref<DocumentModel[]>([])
const dialogVisible = ref(false)
const openDrawer = ref(false)
const checkedItems = ref<DocumentModel[]>([])
const documentTableRef = ref<InstanceType<typeof EIBTable>>()
const uploadTimes = ref(defaultDateRange())
const filterValue = reactive<FilterDocumentModel>({} as FilterDocumentModel)

const handleGetDocuments = async (pagination: PaginationModel) => {
  try {
    const response = await getDocuments({
      ...pagination,
      ...omitPropertyFromObject(filterValue, -1),
      beginDate: uploadTimes.value[0],
      endDate: uploadTimes.value[1]
    })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

const handleRedirectToDocumentDetail = (row: DocumentModel) => {
  router.push(DOCUMENT_DETAIL_PAGE(row.id))
}

const handleClearAllChecked = () => {
  checkedItems.value = []
  documentTableRef.value?.clearSelection()
}

const handleDeleteDocument = (name?: string) => {
  showConfirmModal({
    message: t('docs.document.deleteDocsConfirm', { name: name ?? t('docs.document.selectedDocs') }),
    title: t('docs.document.deleteDocsTitle'),
    successCallback: handleClearAllChecked,
    onConfirm: (instance, done) => {
      setTimeout(() => {
        done()
        instance.confirmButtonLoading = false
      }, 3000)
    }
  })
}

const handleResetFilter = () => {
  filterValue.bizType = -1
  filterValue.branchId = -1
  filterValue.result = -1
  filterValue.status = []
}
</script>

<template>
  <div class="flex flex-row justify-between items-center">
    <Title :title="$t('docs.title')" />
    <div class="flex flex-row gap-5 items-center">
      <span class="font-semibold italic text-base">Ngày upload:</span>
      <el-date-picker
        v-model="uploadTimes"
        type="daterange"
        class="w-fit"
        unlink-panels
        range-separator="đến"
        start-placeholder="Bắt đầu"
        end-placeholder="Kết thúc"
        :shortcuts="shortcutsDateRange"
        :format="formatYYYYMMDD"
        :value-format="formatYYYYMMDD"
      />
    </div>
  </div>
  <div class="flex flex-col mt-2">
    <div class="flex flex-row justify-between gap-10 items-center mb-5">
      <div class="flex flex-row gap5 items-center gap-5">
        <EIBInput
          v-model="filterValue.name"
          custom-class="w-[360px]"
          placeholder="docs.document.searchByName"
          :prefix-icon="Search"
          hidden-error
        />
        <div class="flex flex-row gap-5 items-center">
          <div class="flex flex-row gap-1 items-center p-1 cursor-pointer" @click="openFilter = !openFilter">
            <el-icon><Filter /></el-icon>
            <span class="whitespace-nowrap">Bộ lọc</span>
            <el-icon
              class="ml-2 transition-all duration-300"
              :class="{ 'rotate-180': openFilter, 'rotate-0': !openFilter }"
              ><ArrowDownBold
            /></el-icon>
          </div>
          <el-divider direction="vertical" />
          <span class="text-primary whitespace-nowrap cursor-pointer" @click="handleResetFilter"
            >Khôi phục mặc định</span
          >
          <el-button type="primary" plain @click="() => documentTableRef?.handleGetData()">Tìm kiếm</el-button>
        </div>
      </div>
      <div class="flex flex-row gap-3">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden flex flex-row items-center gap-5"
      :class="{ 'h-10 mb-2': openFilter, 'h-0': !openFilter }"
    >
      <EIBSingleFilter v-model="filterValue.bizType" title="Loại nghiệp vụ" :options="businessTypeOptions" />
      <EIBMultipleFilter v-model="filterValue.status" title="Loại nghiệp vụ" :options="documentStatusOptions" />
      <EIBSingleFilter v-model="filterValue.result" title="Kết quả" :options="documentResultOptions" />
      <EIBSingleFilter v-model="filterValue.branchId" title="SOL" :options="withAllSelection(MOCK_SOLS)" />
    </div>
    <el-card>
      <EIBTable
        ref="documentTableRef"
        locales
        :columnConfigs="docListColumnConfigs"
        :data="tableData"
        :callback="handleGetDocuments"
        @update:selection="(val: DocumentModel[]) => (checkedItems = val)"
        :height="!!checkedItems.length && openFilter ? 520 : !checkedItems.length && !openFilter ? 600 : 560"
        @row-click="handleRedirectToDocumentDetail"
      >
        <template #status="{ row }">
          <span>{{ renderLabelByValue(documentStatusOptions, row.status) }}</span>
        </template>
        <template #businessType="{ row }">
          <span>{{ renderLabelByValue(businessTypeOptions, row.businessType) }}</span>
        </template>
        <template #processingStep="{ row }">
          <span>{{ renderLabelByValue(processingStepOptions, row.processingStep) }}</span>
        </template>
        <template #result="{ row }">
          <span>{{ renderLabelByValue(documentResultOptions, row.result) }}</span>
        </template>
        <template #createdAt="{ row }">
          <span>{{ formatDate(row.createdAt, formatYYYYMMDD_HHMM) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2" @click.stop>
            <SvgIcon :size="18" name="edit-info" @click.stop="openDrawer = true" class="cursor-pointer" />
            <el-icon
              :size="18"
              color="#e03131"
              class="cursor-pointer"
              @click.stop="handleDeleteDocument(row.documentName)"
              ><Delete
            /></el-icon>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>
  <UploadDocuments v-if="dialogVisible" v-model="dialogVisible" />
  <EIBDrawer title="docs.document.updateDocument" v-model="openDrawer">
    <template #default>
      <UpdateDocument @close="openDrawer = false" />
    </template>
  </EIBDrawer>
  <Transition :duration="300" name="nested" class="fixed bottom-0 -ml-5">
    <div v-if="!!checkedItems.length" class="outer px-5 py-3 w-full shadow-md border border-[#f8f9fa] bg-[#4f4f4f1a]">
      <div class="inner flex flex-row gap-x-5 items-center">
        <span class="text-[#495057] text-sm"
          >{{ $t('docs.document.selected') }}
          <strong>{{ checkedItems.length }} {{ $t('docs.document.items') }}</strong>
          <span class="text-blue-500 cursor-pointer ml-1" @click="handleClearAllChecked"
            >( {{ $t('docs.document.cancelAll') }} )</span
          ></span
        >
        <el-button type="danger" plain :icon="Delete" @click="() => handleDeleteDocument()">{{
          $t('button.delete')
        }}</el-button>
      </div>
    </div>
  </Transition>
</template>
