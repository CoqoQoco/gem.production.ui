<template>
  <div class="base-chart-wrapper">
    <div v-if="title" class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-container" :style="containerStyle">
      <Chart
        :type="type"
        :data="chartData"
        :options="chartOptions"
        :class="chartClass"
      />
    </div>
  </div>
</template>

<script>
import Chart from 'primevue/chart'

export default {
  name: 'BaseChart',

  components: {
    Chart
  },

  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'].includes(value)
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
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
    chartClass: {
      type: String,
      default: ''
    }
  },

  computed: {
    chartData() {
      return this.data
    },

    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#e7de99',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6
          }
        },
        ...this.options
      }
    },

    containerStyle() {
      return {
        height: this.height,
        position: 'relative'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-chart-wrapper {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e7de99;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.chart-container {
  width: 100%;
  position: relative;
}
</style>
