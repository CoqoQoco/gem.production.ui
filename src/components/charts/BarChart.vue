<template>
  <BaseChart
    type="bar"
    :data="chartData"
    :options="barOptions"
    :title="title"
    :subtitle="subtitle"
    :height="height"
  />
</template>

<script>
import BaseChart from './BaseChart.vue'

export default {
  name: 'BarChart',

  components: {
    BaseChart
  },

  props: {
    labels: {
      type: Array,
      required: true
    },
    datasets: {
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
    horizontal: {
      type: Boolean,
      default: false
    },
    stacked: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: this.datasets.map((dataset, index) => ({
          label: dataset.label || `Dataset ${index + 1}`,
          data: dataset.data || [],
          backgroundColor: dataset.backgroundColor || this.getDefaultColor(index, 0.6),
          borderColor: dataset.borderColor || this.getDefaultColor(index, 1),
          borderWidth: dataset.borderWidth || 2,
          borderRadius: dataset.borderRadius !== undefined ? dataset.borderRadius : 8,
          ...dataset
        }))
      }
    },

    barOptions() {
      return {
        indexAxis: this.horizontal ? 'y' : 'x',
        scales: {
          x: {
            stacked: this.stacked,
            grid: {
              display: !this.horizontal,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            stacked: this.stacked,
            beginAtZero: true,
            grid: {
              display: this.horizontal,
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        },
        plugins: {
          legend: {
            display: this.datasets.length > 1
          }
        }
      }
    }
  },

  methods: {
    getDefaultColor(index, alpha = 1) {
      const colors = [
        `rgba(231, 222, 153, ${alpha})`, // Gold
        `rgba(59, 130, 246, ${alpha})`,  // Blue
        `rgba(16, 185, 129, ${alpha})`,  // Green
        `rgba(239, 68, 68, ${alpha})`,   // Red
        `rgba(147, 51, 234, ${alpha})`,  // Purple
        `rgba(245, 158, 11, ${alpha})`,  // Orange
        `rgba(6, 182, 212, ${alpha})`,   // Cyan
        `rgba(236, 72, 153, ${alpha})`   // Pink
      ]
      return colors[index % colors.length]
    }
  }
}
</script>
