<template>
  <BaseChart
    type="doughnut"
    :data="chartData"
    :options="doughnutOptions"
    :title="title"
    :subtitle="subtitle"
    :height="height"
  />
</template>

<script>
import BaseChart from './BaseChart.vue'

export default {
  name: 'DoughnutChart',

  components: {
    BaseChart
  },

  props: {
    labels: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '400px'
    },
    backgroundColor: {
      type: Array,
      default: null
    },
    cutout: {
      type: String,
      default: '70%'
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.backgroundColor || this.defaultColors,
            hoverBackgroundColor: this.backgroundColor || this.defaultColors,
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      }
    },

    doughnutOptions() {
      return {
        cutout: this.cutout,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${label}: ${value.toLocaleString('th-TH')} (${percentage}%)`
              }
            }
          }
        }
      }
    },

    defaultColors() {
      return [
        'rgba(231, 222, 153, 0.8)', // Gold
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(16, 185, 129, 0.8)',  // Green
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(147, 51, 234, 0.8)',  // Purple
        'rgba(245, 158, 11, 0.8)',  // Orange
        'rgba(6, 182, 212, 0.8)',   // Cyan
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(99, 102, 241, 0.8)',  // Indigo
        'rgba(20, 184, 166, 0.8)'   // Teal
      ]
    }
  }
}
</script>
