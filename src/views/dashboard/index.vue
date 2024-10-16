<template>
  <div class="dashboard-container">
    <div class="chart-title">Tổng quan về dữ liệu</div>
    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="p-4 box-container-top bg-white dark:bg-[#181818]">
        <div class="chart-box-title">THÔNG TIN CHUNG</div>
        <div class="flex justify-center">
          <apexchart class="w-3/4" type="donut" :options="chartOptions" :series="series" />
        </div>
      </div>
      <div class="p-4 box-container-top bg-white dark:bg-[#181818]">
        <div class="h-1/2">
          <div class="chart-box-title">THÔNG TIN CHỨNG TỪ ĐÃ PHÊ DUYỆT</div>
          <div class="flex pt-2 px-2">
            <div class="w-1/2 flex">
              <DoughnutChart
                :labels="LABEL_VALID_CHARTS"
                :bgcolor="BG_COLOR_VALID_CHARTS"
                :share_percentage="share_percentage_valid"
              />
              <div class="box-subinfo">
                <div class="big-title">900<span class="text-base"> /1000</span></div>
                <div class="big-title-text">Bộ đã phê duyệt</div>
              </div>
            </div>
            <div class="w-1/2 flex items-center">
              <div class="box-paper-right">
                <div class="charts-legend-series">
                  <span class="marker" style="background-color: #7048e8" />
                  <span class="text">BCT hợp lệ</span>
                </div>
                <div class="charts-legend-series">
                  <span class="marker" style="background-color: #d6336c" />
                  <span class="text">BCT bất hợp lệ</span>
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
            <DoughnutChart :bgcolor="BG_COLOR_INVALID_CHARTS" :share_percentage="share_percentage_invalid" />
            <div class="box-subinfo">
              <div class="big-title">764<span class="text-base"> /900</span></div>
              <div class="big-title-text flex">
                Bộ đạt yêu cầu
                <el-dropdown placement="top">
                  <el-icon :size="18" class="cursor-pointer ml-1"><InfoFilled /></el-icon>
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
          <el-select v-model="valueFilterField" class="w-32" @change="getFieldChanged">
            <el-option v-for="item in optionsField" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <Table
          class="table-container pt-2"
          :columnConfigs="fieldChangedListColumnConfigs"
          :data="fieldsChangedData"
          hiddenChecked
          hiddenPagination
        >
          <template #field="{ row }">
            <div>
              <span>{{ row.name }}</span>
              <br />
              <span class="text-[#adb5bd]">{{ row.field }}</span>
            </div>
          </template>
          <template #rate="{ row }">
            <span>{{ renderRate(row.rate) }} </span>
          </template>
        </Table>
      </div>
      <div class="p-4 box-container-bottom bg-white dark:bg-[#181818]">
        <div class="chart-box-title py-2">DANH SÁCH XỬ LÝ THEO SOLS</div>
        <Table
          :columnConfigs="SOLListColumnConfigs"
          :data="SOLData"
          hiddenChecked
          hiddenPagination
          class="table-container"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import VueApexCharts from 'vue3-apexcharts'

import DoughnutChart from './components/DoughnutChart.vue'

import Table from '@/components/common/EIBTable.vue'
import {
  fieldChangedModel,
  fieldChangedListColumnConfigs,
  SOLModel,
  SOLListColumnConfigs,
  chartOptionsSumary,
  optionsFieldChanged
} from '@/@types/pages/dashboard'
import { getFieldsChanged, getSOLs } from '@/api/dashboard'
import { BG_COLOR_INVALID_CHARTS, BG_COLOR_VALID_CHARTS, LABEL_VALID_CHARTS } from '@/constants/chart'

const share_percentage_valid = [800, 100, 100]
const share_percentage_invalid = [746, 154]
const series = ref<number[]>([100, 36, 60, 900, 4, 0])
const fieldsChangedData = ref<fieldChangedModel[]>([])
const valueFilterField = ref('-1')
const SOLData = ref<SOLModel[]>([])
const apexchart = VueApexCharts
const chartOptions = ref<any>(chartOptionsSumary)
const optionsField = ref<any>(optionsFieldChanged)
const getFieldChanged = async () => {
  try {
    const response = await getFieldsChanged(valueFilterField.value)
    fieldsChangedData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}
const getSOL = async () => {
  try {
    const response = await getSOLs()

    SOLData.value = response.data
  } catch (error: any) {
    throw new Error(error)
  }
}
const renderRate = (rate: number) => {
  return rate * 100 + '%'
}
onMounted(() => {
  getFieldChanged()
  getSOL()
})
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
  margin-bottom: 10px;
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
}
.box-container-bottom {
  height: 48vh;
}
.table-container {
  height: 90%;
}
</style>
