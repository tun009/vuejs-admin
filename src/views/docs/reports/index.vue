<script lang="ts" setup>
import { ArrowDownBold, Filter, Search } from '@element-plus/icons-vue'
import { reactive, ref, watch, onMounted, computed } from 'vue'

import { DocumentStatusEnum, PaginationModel } from '@/@types/common'
import {
  ReportModel,
  FilterDocumentModel,
  businessTypeOptions,
  docListColumnConfigs,
  ReportDetailModel,
  reportStatusOptions
} from '@/@types/pages/reports'
import { documentStatusOptions, documentResultOptions, DocumentExportFileEnum } from '@/@types/pages/docs/documents'
import EIBSingleFilter from '@/components/Filter/EIBSingleFilter.vue'
import EIBMultipleFilter from '@/components/Filter/EIBMultipleFilter.vue'
import EIBDrawer from '@/components/common/EIBDrawer.vue'
import EIBInput from '@/components/common/EIBInput.vue'
import EIBTable from '@/components/common/EIBTable.vue'
import { Title } from '@/layouts/components'
import { addOneDayToDate, defaultDateRange, formatDateExactFormat } from '@/utils/date'
import { debounce } from 'lodash-es'
import { getReports, getDetailReport, downloadFileExcel } from '@/api/reports/'
import { formatDDMMYYYY, formatYYYYMMDD, shortcutsDateRange } from '@/constants/date'
import DetailReportForm from './components/DetailReportForm.vue'
import {
  omitPropertyFromObject,
  withAllSelection,
  mappingBranches,
  downloadFileCommon,
  renderLabelByValue
} from '@/utils/common'
import { getBranches } from '@/api/users'
import { BranchModel } from '@/@types/pages/login'
import Status from '../components/Status.vue'
import { errorDocumentStatus } from '@/constants/common'

const openFilter = ref(false)
const defaultStatus = computed(() => {
  return reportStatusOptions.map((c) => c.value as DocumentStatusEnum)
})
const multipleFilterRef = ref<InstanceType<typeof EIBMultipleFilter>>()
const tableData = ref<ReportModel[]>([])
const checkedItems = ref<ReportModel[]>([])
const documentTableRef = ref<InstanceType<typeof EIBTable>>()
const uploadTimes = ref(defaultDateRange())
const filterValue = reactive<FilterDocumentModel>({ status: defaultStatus.value } as FilterDocumentModel)
const openDetailReportDrawer = ref(false)
const branches = ref<BranchModel[]>([])
const reportDetail = ref<ReportDetailModel>({} as ReportDetailModel)

const handleGetReports = async (pagination: PaginationModel) => {
  try {
    const { status, ...otherFilter } = filterValue
    const isErrorStatus = status.includes(DocumentStatusEnum.ERROR)
    let exactStatus = [...status]
    if (isErrorStatus) {
      const statusNoError = exactStatus.filter((e) => e !== DocumentStatusEnum.ERROR)
      exactStatus = [...statusNoError, ...errorDocumentStatus]
    }
    const response = await getReports({
      ...pagination,
      ...omitPropertyFromObject(otherFilter, -1),
      beginDate: formatDateExactFormat(uploadTimes.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(uploadTimes.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      sortItemList: [
        {
          isAsc: false,
          column: 'createdAt'
        }
      ],
      ...(status?.length !== reportStatusOptions.length ? { status: exactStatus } : {})
    })
    tableData.value = response.data.list
    return response
  } catch (error: any) {
    throw new Error(error)
  }
}

const detailReport = async (raw: ReportModel) => {
  try {
    const { data } = await getDetailReport(raw.batchId)
    reportDetail.value = data
  } catch (error) {
    console.error(error)
  }
  openDetailReportDrawer.value = true
}

const handleResetFilter = () => {
  filterValue.bizType = -1
  filterValue.branchId = -1
  filterValue.result = -1
  // filterValue.status = []
  multipleFilterRef.value?.handleCheckAll()
}

const downloadFile = async () => {
  try {
    const pagination = documentTableRef?.value?.getPagination()
    const { status, ...otherFilter } = filterValue
    const isErrorStatus = status.includes(DocumentStatusEnum.ERROR)
    let exactStatus = [...status]
    if (isErrorStatus) {
      exactStatus = exactStatus
        .filter((e) => e !== DocumentStatusEnum.ERROR)
        .concat([
          DocumentStatusEnum.CLASSIFICATION_ERROR,
          DocumentStatusEnum.EXTRACTION_ERROR,
          DocumentStatusEnum.COMPARISON_ERROR
        ])
    }
    const response = await downloadFileExcel({
      ...omitPropertyFromObject(otherFilter, -1),
      beginDate: formatDateExactFormat(uploadTimes.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(uploadTimes.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      sortItemList: [
        {
          isAsc: false,
          column: 'createdAt'
        }
      ],
      ...pagination,
      ...(status?.length !== reportStatusOptions.length ? { status: exactStatus } : {})
    })
    downloadFileCommon(response, DocumentExportFileEnum.EXCEL)
  } catch (error) {
    console.error(error)
  }
}

const handleGetBranches = async () => {
  try {
    const { data } = await getBranches()
    branches.value = data
  } catch (error) {
    console.error(error)
  }
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

onMounted(() => {
  handleGetBranches()
})
</script>

<template>
  <div class="flex flex-row justify-between items-center">
    <Title title="Báo cáo" />
    <div class="flex flex-row gap-5 items-center">
      <span class="font-semibold text-base !text-[14px]">Ngày upload:</span>
      <el-date-picker
        v-model="uploadTimes"
        type="daterange"
        class="w-fit"
        unlink-panels
        :clearable="false"
        :range-separator="$t('docs.document.to')"
        :start-placeholder="$t('docs.document.start')"
        :end-placeholder="$t('docs.document.end')"
        :shortcuts="shortcutsDateRange"
        :format="formatDDMMYYYY"
        :value-format="formatDDMMYYYY"
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
        </div>
      </div>
      <div class="flex flex-row gap-3">
        <el-button type="primary" class="flex flex-row items-center" @click="downloadFile">
          <SvgIcon name="download-inline" class="w-4 h-4 mr-2" />
          <span>Tải xuống</span></el-button
        >
      </div>
    </div>
    <div
      class="transition-all duration-300 overflow-hidden flex flex-row items-center gap-5"
      :class="{ 'h-10 mb-2': openFilter, 'h-0': !openFilter }"
    >
      <EIBSingleFilter v-model="filterValue.bizType" title="Loại nghiệp vụ" :options="businessTypeOptions" />
      <EIBMultipleFilter
        ref="multipleFilterRef"
        v-model="filterValue.status"
        title="Trạng thái"
        :options="reportStatusOptions"
      />
      <EIBSingleFilter v-model="filterValue.result" title="Kết quả" :options="documentResultOptions" />
      <EIBSingleFilter
        v-model="filterValue.branchId"
        title="SOL"
        :options="withAllSelection(mappingBranches(branches))"
      />
    </div>
    <el-card>
      <EIBTable
        ref="documentTableRef"
        locales
        hiddenChecked
        :columnConfigs="docListColumnConfigs"
        :data="tableData"
        :callback="handleGetReports"
        @update:selection="(val: ReportModel[]) => (checkedItems = val)"
        :height="!!checkedItems.length && openFilter ? 520 : !checkedItems.length && !openFilter ? 600 : 560"
        @row-click="detailReport"
      >
        <template #branch="{ row }">
          <div class="h-10">
            <span>{{ row?.branch?.name }}</span>
            <br />
            <span class="!text-[#868e96]">{{ row?.branch?.code }}</span>
          </div>
        </template>
        <template #bizType="{ row }">
          <span>{{ renderLabelByValue(businessTypeOptions, row?.bizType) }}</span>
        </template>
        <template #status="{ row }">
          <Status :options="documentStatusOptions" :status="row?.status" />
        </template>
        <template #result="{ row }">
          <Status :options="documentResultOptions" :status="row?.result" />
        </template>
      </EIBTable>
    </el-card>
  </div>
  <EIBDrawer
    title="Thông tin chi tiết"
    v-model="openDetailReportDrawer"
    v-if="openDetailReportDrawer"
    :is-confirm-close="false"
  >
    <template #default>
      <DetailReportForm @close="openDetailReportDrawer = false" :data="reportDetail" />
    </template>
  </EIBDrawer>
</template>
