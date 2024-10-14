<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

ChartJS.register({
  afterDraw: (chart: any) => {
    const { ctx, chartArea } = chart
    const text = chart.options.plugins.customCenterText.text
    const fontSize = chart.options.plugins.customCenterText.fontSize
    const fontFamily = chart.options.plugins.customCenterText.fontFamily

    if (text) {
      ctx.save()
      ctx.font = `${fontSize}px ${fontFamily}`
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
  share_percentage: number[]
}>()

const chartData = computed(() => ({
  datasets: [
    {
      backgroundColor: props.bgcolor,
      borderColor: '#777',
      borderWidth: 0,
      data: props.share_percentage
    }
  ],
  labels1: props.labels
}))

const chartOptions = computed(() => ({
  aspectRatio: 1,
  cutout: '70%',
  maintainAspectRatio: false,
  plugins: {
    customCenterText: {
      color: '#495057',

      fontFamily: 'Montserrat',

      fontSize: '15',

      fontWeight: '600',
      //   text: `Tổng ${((props.share_percentage[0] / props.share_percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(0)}%`,
      text: `90.0%`
    },
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.label || ''
          const value = tooltipItem.raw || 0
          const percentage = ((value / props.share_percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(2)
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
