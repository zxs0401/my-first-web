<template>
  <div class="chart-container">
    <Line v-if="loaded" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'WeightChart',
  components: { Line },
  props: {
    historyData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loaded: false
    }
  },
  mounted() {
    this.loaded = true
  },
  computed: {
    chartData() {
      const dates = this.historyData.map(record => this.formatDate(record.date))
      const weights = this.historyData.map(record => record.weight)
      const bodyFats = this.historyData.map(record => record.bodyFat)

      return {
        labels: dates,
        datasets: [
          {
            label: '体重 (kg)',
            backgroundColor: '#42b983',
            borderColor: '#42b983',
            data: weights,
            fill: false
          },
          {
            label: '体脂率 (%)',
            backgroundColor: '#ff7979',
            borderColor: '#ff7979',
            data: bodyFats,
            fill: false
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
  margin: 20px 0;
}
</style> 