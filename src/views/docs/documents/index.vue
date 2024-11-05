<script lang="ts" setup>
import { ArrowDownBold, Delete, Filter, Plus, Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import UploadDocuments from '../components/UploadDocuments.vue'
import UpdateDocument from './components/UpdateDocument.vue'

import { DocumentStatusEnum, PaginationModel } from '@/@types/common'
import {
  DocumentModel,
  FilterDocumentModel,
  businessTypeOptions,
  docListColumnConfigs,
  documentResultOptions,
  documentStatusOptions,
  processingStepOptions
} from '@/@types/pages/docs/documents'
import { BranchModel } from '@/@types/pages/login'
import { deleteDocument, getBranches, getDocuments } from '@/api/docs/document'
import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import {
  TIME_FIRST_DAY,
  TIME_LAST_DAY,
  formatYYYYMMDD,
  formatYYYYMMDD_HHMM,
  shortcutsDateRange
} from '@/constants/date'
import { DOCUMENT_DETAIL_PAGE } from '@/constants/router'
import { useConfirmModal } from '@/hooks/useConfirm'
import { Title } from '@/layouts/components'
import { useUserStore } from '@/store/modules/user'
import { mappingBranches, omitPropertyFromObject, renderLabelByValue, withAllSelection } from '@/utils/common'
import { defaultDateRange, formatDate } from '@/utils/date'
import { debounce } from 'lodash-es'
import Status from '../components/Status.vue'

const { t } = useI18n()
const router = useRouter()
const { showConfirmModal } = useConfirmModal()
const { isViewer } = useUserStore()

const openFilter = ref(false)
const tableData = ref<DocumentModel[]>([])
const rowSelect = ref<DocumentModel>({} as DocumentModel)
const dialogVisible = ref(false)
const openDrawer = ref(false)
const checkedItems = ref<DocumentModel[]>([])
const documentTableRef = ref<InstanceType<typeof EIBTable>>()
const uploadTimes = ref(defaultDateRange())
const filterValue = reactive<FilterDocumentModel>({} as FilterDocumentModel)
const branches = ref<BranchModel[]>([])

const handleGetDocuments = async (pagination: PaginationModel) => {
  try {
    const { status, ...otherFilter } = filterValue
    const response = await getDocuments({
      ...pagination,
      ...omitPropertyFromObject(otherFilter, -1),
      beginDate: uploadTimes.value[0] + TIME_FIRST_DAY,
      endDate: uploadTimes.value[1] + TIME_LAST_DAY,
      sortItemList: [
        {
          isAsc: false,
          column: 'createdAt'
        }
      ],
      ...(status?.length ? { status } : {})
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

const handleDeleteDocument = (data?: DocumentModel) => {
  showConfirmModal({
    message: t('docs.document.deleteDocsConfirm', { name: data?.dossierName ?? t('docs.document.selectedDocs') }),
    title: t('docs.document.deleteDocsTitle'),
    successCallback: handleClearAllChecked,
    onConfirm: async (instance, done) => {
      try {
        if (data) {
          await deleteDocument([data?.id ?? ''])
        } else {
          const ids = checkedItems.value.map((i) => i.id)
          await deleteDocument(ids)
        }
        handleGetData()
        done()
      } catch (error) {
        console.error(error)
      } finally {
        instance.confirmButtonLoading = false
      }
    }
  })
}

const handleResetFilter = () => {
  filterValue.bizType = -1
  filterValue.branchId = -1
  filterValue.result = -1
  filterValue.status = []
}

const handleGetData = debounce(() => documentTableRef?.value?.handleGetData(), 300)

watch(
  [() => filterValue, () => uploadTimes],
  async () => {
    handleGetData()
  },
  {
    deep: true
  }
)

const handleUpdateDocument = (row: DocumentModel) => {
  openDrawer.value = true
  rowSelect.value = row
}

const handleGetBranches = async () => {
  try {
    const { data } = await getBranches()
    branches.value = data
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  handleGetBranches()
})
</script>

<template>
  <div class="flex flex-row justify-between items-center">
    <Title :title="$t('docs.title')" />
    <div class="flex flex-row gap-5 items-center">
      <span class="font-semibold italic text-base">{{ $t('docs.document.uploadDate') }}</span>
      <el-date-picker
        v-model="uploadTimes"
        type="daterange"
        class="w-fit"
        unlink-panels
        :range-separator="$t('docs.document.to')"
        :start-placeholder="$t('docs.document.start')"
        :end-placeholder="$t('docs.document.end')"
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
            <span class="whitespace-nowrap">{{ $t('docs.document.filter') }}</span>
            <el-icon
              class="ml-2 transition-all duration-300"
              :class="{ 'rotate-180': openFilter, 'rotate-0': !openFilter }"
              ><ArrowDownBold
            /></el-icon>
          </div>
          <el-divider direction="vertical" />
          <span class="text-primary whitespace-nowrap cursor-pointer" @click="handleResetFilter">{{
            $t('docs.document.resetToDefault')
          }}</span>
        </div>
      </div>
      <div v-if="!isViewer" class="flex flex-row gap-3">
        <el-button type="primary" :icon="Plus" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden flex flex-row items-center gap-5"
      :class="{ 'h-10 mb-2': openFilter, 'h-0': !openFilter }"
    >
      <EIBSingleFilter
        v-model="filterValue.bizType"
        :title="$t('docs.document.businessType')"
        :options="businessTypeOptions"
      />
      <EIBMultipleFilter
        v-model="filterValue.status"
        :title="$t('docs.document.status')"
        :options="documentStatusOptions"
      />
      <EIBSingleFilter
        v-model="filterValue.result"
        :title="$t('docs.document.result')"
        :options="documentResultOptions"
      />
      <EIBSingleFilter
        v-model="filterValue.branchId"
        :title="$t('docs.document.sol')"
        :options="withAllSelection(mappingBranches(branches))"
      />
    </div>
    <el-card>
      <EIBTable
        ref="documentTableRef"
        locales
        :columnConfigs="isViewer ? docListColumnConfigs.slice(0, -1) : docListColumnConfigs"
        :data="tableData"
        :callback="handleGetDocuments"
        @update:selection="(val: DocumentModel[]) => (checkedItems = val)"
        :height="!!checkedItems.length && openFilter ? 520 : !checkedItems.length && !openFilter ? 600 : 560"
        @row-click="handleRedirectToDocumentDetail"
        :hidden-checked="isViewer"
      >
        <template #status="{ row }">
          <Status :options="documentStatusOptions" :status="row?.status" />
        </template>
        <template #bizType="{ row }">
          <span>{{ renderLabelByValue(businessTypeOptions, row?.bizType) }}</span>
        </template>
        <template #step="{ row }">
          <span>{{ renderLabelByValue(processingStepOptions, row?.step) }}</span>
        </template>
        <template #result="{ row }">
          <Status :options="documentResultOptions" :status="row?.result" />
        </template>
        <template #createdAt="{ row }">
          <span>{{ formatDate(row.createdAt, formatYYYYMMDD_HHMM) }}</span>
        </template>
        <template #branchName="{ row }">
          <span>{{ row?.branch?.name }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex flex-row gap-2 items-center h-[63px] px-3" @click.stop>
            <div class="w-[18px]">
              <SvgIcon
                v-if="![DocumentStatusEnum.DENIED, DocumentStatusEnum.VALIDATED].includes(row.status)"
                :size="18"
                name="edit-info"
                @click.stop="handleUpdateDocument(row)"
                class="cursor-pointer"
              />
            </div>
            <div class="w-[18px] h-[18px]">
              <el-icon :size="18" color="#e03131" class="cursor-pointer" @click.stop="handleDeleteDocument(row)"
                ><Delete
              /></el-icon>
            </div>
          </div>
        </template>
      </EIBTable>
    </el-card>
  </div>
  <UploadDocuments v-if="dialogVisible" v-model="dialogVisible" @refresh="documentTableRef?.handleGetData()" />
  <EIBDrawer title="docs.document.updateDocument" v-model="openDrawer" v-if="openDrawer">
    <template #default>
      <UpdateDocument @close="openDrawer = false" :data="rowSelect" @refresh="documentTableRef?.handleGetData()" />
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
