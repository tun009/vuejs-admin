<script lang="ts" setup>
import { DasboardOverviewModel } from '@/@types/pages/dashboard'
import { formatNumberConfidence } from '@/utils/common'
import { onUpdated, ref, watch } from 'vue'
const props = defineProps<{
  data: DasboardOverviewModel
}>()
const totalDossiers = ref<number>(0)
const isRendenderChart = ref<boolean>(false)
watch(
  () => props.data,
  (value, oldValue) => {
    const newOptions = { ...options.value, data: [...options.value.data] }
    newOptions.data[0].dataPoints = newOptions.data[0].dataPoints.map((item) => ({
      ...item,
      y: value[item.key] || 0
    }))
    options.value = newOptions
    totalDossiers.value = options.value.data[0].dataPoints.reduce((sum, item) => sum + item.y, 0)
    if (totalDossiers.value > 0) {
      renderIndexLabel()
      if (Object.keys(oldValue).length > 0) reRenderText(200)
      isRendenderChart.value = true
    } else isRendenderChart.value = false
  },
  { deep: true }
)
const renderIndexLabel = () => {
  const dataPoints = options.value.data[0].dataPoints
  for (let i = 0; i < dataPoints.length; i++) {
    if (dataPoints[i].y > 0) {
      const percentage = totalDossiers.value > 0 ? formatNumberConfidence(dataPoints[i].y / totalDossiers.value) : 0
      // dataPoints[i].indexLabel = `${dataPoints[i].name}: ${dataPoints[i].y} (${percentage}%)`
      dataPoints[i].indexLabel = percentage + '%'
    } else dataPoints[i].indexLabel = ''
  }
}
const chartSumary = ref()
const onClickPie = () => {
  reRenderText(1500)
}
const options = ref({
  theme: 'light2',
  animationEnabled: true,
  data: [
    {
      type: 'doughnut',
      startAngle: 45,
      click: onClickPie,
      showInLegend: false,
      // indexLabel: '{name}: {y}(#percent%)',
      yValueFormatString: '#,##0',
      toolTipContent: "<span style='\"'color: {color};'\"'>{name}</span>, {y} bộ chứng từ",
      dataPoints: [
        { name: 'Đã tải lên', y: 0, color: '#ced4da', key: 'totalDossierRecentUpload', indexLabel: '' },
        { name: 'Đang xử lý', y: 0, color: '#fab005', key: 'totalDossierInProgress', indexLabel: '' },
        { name: 'Đã kiểm tra', y: 0, color: '#1971c2', key: 'totalDossierChecked', indexLabel: '' },
        { name: 'Đã phê duyệt', y: 0, color: '#0ca678', key: 'totalDossierValidated', indexLabel: '' },
        { name: 'Từ chối', y: 0, color: '#e03131', key: 'totalDossierDenied', indexLabel: '' },
        { name: 'Lỗi', y: 0, color: '#a61e4d', key: 'totalDossierError', indexLabel: '' }
      ]
    }
  ]
  // legend: {
  //   horizontalAlign: 'right',
  //   verticalAlign: 'center',
  //   position: 'right',
  //   dockInsidePlotArea: false,
  //   itemHeight: 500,
  //   maxHeight: 500,
  //   itemTextFormatter: (e: any) => {
  //     return `${e.dataPoint.label}: ${e.dataPoint.y}`
  //   }
  // }
  //   subtitles: [
  //     {
  //       type: 'text',
  //       text: '1000',
  //       fontSize: 16,
  //       fontColor: '#000',
  //       horizontalAlign: 'center',
  //       verticalAlign: 'center',
  //       dockInsidePlotArea: true
  //     }
  //   ]
})

const styleOptions = ref({
  width: '500px',
  height: '26vh'
})
const drawCustomText = (chart: any) => {
  const ctx = chart.ctx
  const centerX = chart.bounds?.x2 ?? 0
  const centerY = chart?.bounds?.y2 ?? 0
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(totalDossiers.value, centerX / 2, centerY / 2 - 10)
  ctx.font = '14px Arial'
  ctx.fillStyle = '#868e96'
  ctx.fillText('Bộ chứng từ', centerX / 2, centerY / 2 + 10)
  ctx.restore()
}
const reRenderText = (time: number = 1000) => {
  setTimeout(() => {
    const chart = chartSumary.value?.chart
    if (chart) {
      drawCustomText(chart)
    }
  }, time)
}
window.addEventListener('resize', () => {
  reRenderText(2000)
})
onUpdated(() => {
  reRenderText(2000)
})
</script>
<template>
  <CanvasJSChart :options="options" :styles="styleOptions" ref="chartSumary" v-if="isRendenderChart" />
  <div class="mt-[30px] mr-[10%]" v-else>
    <el-progress :width="170" type="circle" :percentage="0" :stroke-width="22" color="#dee2e6">
      <template #default>
        <div class="font-semibold text-[20px]">0</div>
        <div class="text-[14px] text-[#868e96] mt-[5px]">Bộ chứng từ</div>
      </template>
    </el-progress>
  </div>
  <div class="flex items-center">
    <div>
      <div v-for="(item, index) in options.data[0]?.dataPoints" :key="index" class="flex gap-1 mt-1">
        <span
          class="min-w-[16px] min-h-[16px] max-w-[16px] max-h-[16px] rounded-[8px] mt-[1px]"
          :style="`background-color:${item.color}`"
        />
        <span>{{ item.name }}: </span>{{ item.y }}
      </div>
    </div>
  </div>
</template>

<style lang="css">
.canvasjs-chart-credit {
  display: none;
}
</style>
