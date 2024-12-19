<template>
  <div class="dashboard-container">
    <div class="chart-title">Tổng quan về dữ liệu</div>
    <div class="flex gap-[20px] my-[10px]">
      <div class="ml-1">
        <span class="font-bold mr-[6px]">Ngày:</span>
        <el-date-picker
          v-model="dateTimeFilter"
          type="daterange"
          class="w-[200px]"
          unlink-panels
          range-separator="đến"
          start-placeholder="Bắt đầu"
          end-placeholder="Kết thúc"
          :shortcuts="shortcutsDateRange"
          :format="formatDDMMYYYY"
          :value-format="formatDDMMYYYY"
          :clearable="false"
        />
      </div>
      <div class="flex">
        <span class="font-bold m-auto mr-[6px]">Loại nghiệp vụ:</span>
        <EIBSelect class="!w-[200px]" v-model="filterValue.bizType" :options="businessTypeOptions" hiddenError />
      </div>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="p-4 box-container-top bg-white dark:bg-[#181818]">
        <div class="chart-box-title">THÔNG TIN CHUNG</div>
        <div class="flex justify-center">
          <SumaryChart :data="chartData" />
        </div>
      </div>
      <div class="p-4 box-container-top bg-white dark:bg-[#181818]">
        <div class="h-1/2">
          <div class="chart-box-title">THÔNG TIN CHỨNG TỪ ĐÃ PHÊ DUYỆT</div>
          <div class="flex pt-2 px-2">
            <div class="w-1/2 flex">
              <DoughnutChart
                :bgcolor="BG_COLOR_VALID_CHARTS"
                :percentage="percentage_valid"
                :text-label="textLabelValid"
              />
              <div class="box-subinfo">
                <div class="big-title">
                  {{ (chartData?.totalDossierValid ?? 0) + (chartData?.totalDossierInvalid ?? 0)
                  }}<span class="text-base"> /{{ chartData?.totalDossier }} </span>
                </div>
                <div class="big-title-text">Bộ đã phê duyệt</div>
              </div>
            </div>
            <div class="w-1/2 flex items-center">
              <div class="box-paper-right">
                <div class="charts-legend-series">
                  <span class="marker" style="background-color: #7048e8" />
                  <span class="text">BCT hợp lệ: {{ chartData?.totalDossierValid }}</span>
                </div>
                <div class="charts-legend-series">
                  <span class="marker" style="background-color: #d6336c" />
                  <span class="text">BCT bất hợp lệ: {{ chartData?.totalDossierInvalid }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-1/2">
          <div class="chart-box-title pt-2">
            <span>THÔNG TIN CHỨNG TỪ ĐẠT YÊU CẦU</span>
          </div>
          <div class="flex pt-2 px-2">
            <DoughnutChart
              :bgcolor="BG_COLOR_INVALID_CHARTS"
              :percentage="percentage_passed"
              :text-label="textLabelPassed"
              text-color="#087f5b"
            />
            <div class="box-subinfo">
              <div class="big-title">
                {{ chartData.totalDossierPassed }}<span class="text-base"> /{{ chartData.totalDossierValidated }}</span>
              </div>
              <div class="big-title-text flex">
                Bộ đạt yêu cầu
                <el-dropdown placement="top">
                  <el-icon :size="18" class="cursor-pointer ml-1 outline-[0px]"><InfoFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <div class="px-1">
                        Đạt yêu cầu = người dùng không cần chỉnh sửa: kết quả OCR,<br />
                        rule áp dụng và kết quả đối sánh Tính hợp lệ BCT
                      </div>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 box-container-bottom bg-white dark:bg-[#181818]">
        <div class="chart-box-title flex justify-between items-center">
          <span>TOP 20 TỈ LỆ SỬA TRƯỜNG DỮ LIỆU</span>
          <EIBSelect class="!w-[200px]" v-model="filterValue.docTypeId" :options="documentTypes" hiddenError />
        </div>
        <EIBTable
          class="table-container pt-2"
          :columnConfigs="fieldChangedListColumnConfigs"
          :data="fieldsChangedData"
          height="100%"
          hiddenChecked
          hiddenPagination
        >
          <template #key="{ row }">
            <div>
              <span>{{ row.key }}</span>
              <br />
              <span class="text-[#adb5bd]">{{ row.docType }}</span>
            </div>
          </template>
          <template #rate="{ row }">
            <span>{{ renderRate(row.rate) }} </span>
          </template>
        </EIBTable>
      </div>
      <div class="p-4 box-container-bottom bg-white dark:bg-[#181818]">
        <div class="chart-box-title pt-2 pb-[10px]">DANH SÁCH XỬ LÝ THEO SOLS</div>
        <EIBTable
          :columnConfigs="SOLListColumnConfigs"
          :data="SOLData"
          height="100%"
          hiddenChecked
          hiddenPagination
          class="table-container"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import EIBSelect from '@/components/common/EIBSelect.vue'
import { businessTypeOptions } from '@/@types/pages/docs/documents'
import DoughnutChart from './components/DoughnutChart.vue'
import SumaryChart from './components/SumaryChart.vue'
import { formatDDMMYYYY, formatYYYYMMDD, shortcutsDateRange } from '@/constants/date'
import EIBTable from '@/components/common/EIBTable.vue'
import {
  fieldChangedListColumnConfigs,
  SOLListColumnConfigs,
  FilterReportRatioModel,
  DasboardRatioModel,
  DasboardOverviewModel,
  DasboardBranchModel
} from '@/@types/pages/dashboard'
import { getDashboardBranchApi, getDashboardRatioApi, getDashboardSumaryApi } from '@/api/dashboard'
import { BG_COLOR_INVALID_CHARTS, BG_COLOR_VALID_CHARTS } from '@/constants/chart'
import { addOneDayToDate, defaultDateRange, formatDateExactFormat } from '@/utils/date'
import { formatNumberConfidence, omitPropertyFromObject } from '@/utils/common'
import { getDocummentTypeApi } from '@/api/extract'
import { SelectOptionModel } from '@/@types/common'

const dateTimeFilter = ref(defaultDateRange())
const filterValue = reactive<FilterReportRatioModel>({ bizType: -1, docTypeId: -1 } as FilterReportRatioModel)

const percentage_valid = ref<number[]>([])
const textLabelValid = ref<string>('0%')
const textLabelPassed = ref<string>('0%')
const percentage_passed = ref<number[]>([])
const fieldsChangedData = ref<DasboardRatioModel[]>([] as DasboardRatioModel[])
const SOLData = ref<DasboardBranchModel[]>([] as DasboardBranchModel[])
const chartData = ref<DasboardOverviewModel>({})
const documentTypes = ref<SelectOptionModel[]>([])
const initDossierTypes = async () => {
  try {
    const response = await getDocummentTypeApi()
    documentTypes.value = [
      { label: 'Tất cả', value: -1 },
      ...response.data.map((item) => ({
        label: item.name,
        value: item.id
      }))
    ]
  } catch (error: any) {
    throw new Error(error)
  }
}
const getOverview = async () => {
  try {
    const response = await getDashboardSumaryApi({
      beginDate: formatDateExactFormat(dateTimeFilter.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(dateTimeFilter.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      ...(filterValue.bizType === -1 ? {} : { bizType: filterValue.bizType })
    })
    // hard code
    // response.data.totalDossierValidated = 150
    chartData.value = response.data
    const totalDossier = response?.data?.totalDossier ?? 0
    const totalDossierValid = response?.data?.totalDossierValid ?? 0
    const totalDossierInvalid = response?.data?.totalDossierInvalid ?? 0
    const totalDossierValidated = response?.data?.totalDossierValidated ?? 0
    const totalDossierPassed = response?.data?.totalDossierPassed ?? 0

    percentage_valid.value = [
      totalDossierValid,
      totalDossierInvalid,
      totalDossier - (totalDossierValid + totalDossierInvalid)
    ]
    textLabelValid.value =
      (totalDossier > 0 ? formatNumberConfidence((totalDossierValid + totalDossierInvalid) / totalDossier) : 0) + '%'
    percentage_passed.value = [totalDossierPassed, totalDossierValidated - totalDossierPassed]
    textLabelPassed.value =
      (totalDossierValidated > 0 ? formatNumberConfidence(totalDossierPassed / totalDossierValidated) : 0) + '%'
  } catch (error: any) {
    throw new Error(error)
  }
}
const getRatio = async () => {
  try {
    const response = await getDashboardRatioApi({
      beginDate: formatDateExactFormat(dateTimeFilter.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(dateTimeFilter.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      ...omitPropertyFromObject(filterValue, -1)
    })

    fieldsChangedData.value = response.data.map((item) => ({
      ...item,
      editRatio: formatNumberConfidence(Number(item.editRatio) ?? 0) + '%'
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}
const getStatsBranch = async () => {
  try {
    const response = await getDashboardBranchApi({
      beginDate: formatDateExactFormat(dateTimeFilter.value[0], formatDDMMYYYY, formatYYYYMMDD),
      endDate: addOneDayToDate(formatDateExactFormat(dateTimeFilter.value[1], formatDDMMYYYY, formatYYYYMMDD)),
      ...omitPropertyFromObject(filterValue, -1)
    })
    SOLData.value = response.data.map((item, index) => ({
      ...item,
      stt: index + 1,
      code: item.branch.code,
      name: item.branch.name
    }))
  } catch (error: any) {
    throw new Error(error)
  }
}
const renderRate = (rate: number) => {
  return rate * 100 + '%'
}
onMounted(() => {
  initDossierTypes()
  // getOverview()
})
watch(
  [() => filterValue.bizType, () => dateTimeFilter],
  async () => {
    getOverview()
    getRatio()
    getStatsBranch()
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  [() => filterValue.docTypeId],
  async () => {
    getRatio()
  },
  {
    deep: true
  }
)
</script>

<style scoped>
.dashboard-container {
  color: #495057;
  font-size: 14px;
}
.chart-title {
  font-size: 20px;
  font-weight: 500;
  color: #495057;
}
.chart-box-title {
  font-size: 13px;
  font-weight: 500;
}
.big-title {
  font-size: 24px;
  font-weight: 600;
}
.big-title-text {
  font-size: 13px;
}
.box-subinfo {
  margin: auto 0;
  margin-left: 12px;
}
.marker {
  width: 8px;
  height: 8px;
}
.charts-legend-series {
  column-gap: 5px;
  align-items: center;
  display: flex;
}
.box-paper-right {
  border-left: 1px solid #d9d9d9;
  padding-left: 20px;
}
.vue-apexcharts {
  width: 400px !important;
  height: 300px !important;
}
.box-container-top {
  height: 30vh;
  min-height: 250px;
}
.box-container-bottom {
  height: 48vh;
}
.table-container {
  height: 90%;
}
</style>
<style lang="css">
.dashboard-container {
  .el-select--large .el-select__wrapper {
    min-height: 32px;
  }
}
</style>
