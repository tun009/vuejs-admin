<template>
  <div class="chart-container">
    <el-progress v-if="isEmptyChart" :width="74" type="circle" :percentage="100" :stroke-width="10" color="#ced4da">
      <template #default>
        <div class="text-[14px]">0%</div>
      </template>
    </el-progress>
    <Doughnut v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

ChartJS.register({
  afterDraw: (chart: any) => {
    const { ctx, chartArea } = chart
    const text = chart.options.plugins.customCenterText.text
    const fontSize = chart.options.plugins.customCenterText.fontSize
    const fontFamily = chart.options.plugins.customCenterText.fontFamily
    const fontWeight = chart.options.plugins.customCenterText.fontWeight

    if (text) {
      ctx.save()
      ctx.font = `${fontSize}px ${fontFamily} ${fontWeight}`
      ctx.fillStyle = chart.options.plugins.customCenterText.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        text,
        chartArea.left + (chartArea.right - chartArea.left) / 2,
        chartArea.top + (chartArea.bottom - chartArea.top) / 2
      )
      ctx.restore()
    }
  },
  id: 'customCenterText'
})

const props = defineProps<{
  labels?: string[]
  bgcolor: string[]
  percentage: number[]
  textLabel: string
  textColor?: string
}>()
const isEmptyChart = computed(() => {
  return props.percentage.every((val) => val === 0)
})
const chartData = computed(() => ({
  datasets: [
    {
      backgroundColor: props.bgcolor,
      borderColor: '#777',
      borderWidth: 0,
      data: props.percentage
    }
  ]
  // labels: props.labels
}))

const chartOptions = computed(() => ({
  aspectRatio: 1,
  cutout: '70%',
  maintainAspectRatio: false,
  plugins: {
    customCenterText: {
      color: props.textColor || '#495057',

      fontFamily: 'Montserrat',

      fontSize: '14',

      fontWeight: '600',
      //   text: `Tổng ${((props.percentage[0] / props.percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(0)}%`,
      text: props.textLabel
    },
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.label || ''
          const value = tooltipItem.raw || 0
          const percentage = ((value / props.percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(2)
          return `${label}: ${value} (${percentage}%)`
        }
      },
      enabled: false
    }
  },
  responsive: true
}))
</script>

<style scoped>
.chart-container {
  width: 80px;
  height: 80px;
}
</style>
