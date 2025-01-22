<template>
  <div class="body-data">
    <h2>身体数据</h2>
    <div class="data-container">
      <div class="data-input">
        <div class="input-group">
          <label>体重 (kg)</label>
          <input type="number" v-model="bodyData.weight" step="0.1" />
        </div>
        <div class="input-group">
          <label>身高 (cm)</label>
          <input type="number" v-model="bodyData.height" />
        </div>
        <div class="input-group">
          <label>体脂率 (%)</label>
          <input type="number" v-model="bodyData.bodyFat" step="0.1" />
        </div>
        <button @click="saveData" class="save-btn">保存数据</button>
      </div>

      <div class="data-summary">
        <div class="summary-item">
          <h3>BMI 指数</h3>
          <p>{{ calculateBMI }}</p>
          <span class="bmi-status">{{ bmiStatus }}</span>
        </div>
      </div>

      <div class="chart-section">
        <h3>趋势图表</h3>
        <WeightChart :historyData="historyData" />
      </div>

      <div class="data-history">
        <h3>历史记录</h3>
        <div class="history-list">
          <div v-for="(record, index) in historyData" 
               :key="index" 
               class="history-item">
            <div class="record-date">{{ formatDate(record.date) }}</div>
            <div class="record-data">
              <span>体重: {{ record.weight }}kg</span>
              <span>身高: {{ record.height }}cm</span>
              <span>体脂率: {{ record.bodyFat }}%</span>
              <span>BMI: {{ calculateHistoryBMI(record) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WeightChart from './WeightChart.vue'

export default {
  name: 'BodyData',
  components: {
    WeightChart
  },
  data() {
    return {
      bodyData: {
        weight: '',
        height: '',
        bodyFat: ''
      },
      historyData: JSON.parse(localStorage.getItem('bodyDataHistory')) || []
    }
  },
  computed: {
    calculateBMI() {
      if (this.bodyData.weight && this.bodyData.height) {
        const heightInMeters = this.bodyData.height / 100
        return (this.bodyData.weight / (heightInMeters * heightInMeters)).toFixed(1)
      }
      return '---'
    },
    bmiStatus() {
      const bmi = this.calculateBMI
      if (bmi === '---') return ''
      if (bmi < 18.5) return '偏瘦'
      if (bmi < 24) return '正常'
      if (bmi < 28) return '偏重'
      return '肥胖'
    }
  },
  methods: {
    saveData() {
      if (this.bodyData.weight && this.bodyData.height && this.bodyData.bodyFat) {
        const newRecord = {
          ...this.bodyData,
          date: new Date().toISOString()
        }
        this.historyData.unshift(newRecord)
        localStorage.setItem('bodyDataHistory', JSON.stringify(this.historyData))
        this.resetForm()
      } else {
        alert('请填写完整信息')
      }
    },
    resetForm() {
      this.bodyData = {
        weight: '',
        height: '',
        bodyFat: ''
      }
    },
    calculateHistoryBMI(record) {
      const heightInMeters = record.height / 100
      return (record.weight / (heightInMeters * heightInMeters)).toFixed(1)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.body-data {
  padding: 20px;
}

.data-container {
  max-width: 800px;
  margin: 0 auto;
}

.data-input {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 8px;
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.save-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.data-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.summary-item {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.summary-item h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.summary-item p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.bmi-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-top: 5px;
  background-color: #e9ecef;
}

.history-list {
  margin-top: 20px;
}

.history-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.record-date {
  color: #666;
  margin-bottom: 5px;
}

.record-data {
  display: flex;
  gap: 20px;
}

.record-data span {
  color: #2c3e50;
}

.chart-section {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}
</style> 