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
  id: 'customCenterText',
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
  }
})

const props = defineProps<{
  labels: string[]
  bgcolor: string[]
  share_percentage: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: props.bgcolor,
      data: props.share_percentage,
      borderWidth: 0,
      borderColor: '#777'
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 1,
  cutout: '70%',
  plugins: {
    legend: {
      display: false,
      position: 'bottom'
    },
    tooltip: {
      enabled: false,
      callbacks: {
        label: (tooltipItem: any) => {
          const label = tooltipItem.label || ''
          const value = tooltipItem.raw || 0
          const percentage = ((value / props.share_percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(2)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    },
    customCenterText: {
      //   text: `Tổng ${((props.share_percentage[0] / props.share_percentage.reduce((a, b) => a + b, 0)) * 100).toFixed(0)}%`,
      text: `90.0%`,
      color: '#495057',
      fontSize: '15',
      fontWeight: '600',
      fontFamily: 'Montserrat'
    }
  }
}))
</script>

<style scoped>
.chart-container {
  width: 80px;
  height: 80px;
}
</style>
