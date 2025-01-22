<template>
  <div class="training-plan">
    <h2>训练计划</h2>
    <div class="plan-container">
      <div class="add-plan-form" v-if="showAddForm">
        <input v-model="newPlan.name" placeholder="训练名称" />
        <div class="date-input">
          <input 
            type="date" 
            v-model="newPlan.date"
            :min="today"
          />
          <span class="weekday">{{ getWeekday(newPlan.date) }}</span>
        </div>
        <textarea v-model="newPlan.content" placeholder="训练内容"></textarea>
        <div class="form-buttons">
          <button @click="savePlan" class="save-btn">保存</button>
          <button @click="cancelAdd" class="cancel-btn">取消</button>
        </div>
      </div>
      <div class="add-plan" v-else>
        <button @click="showAddForm = true">添加新计划</button>
      </div>
      <div class="plan-list">
        <div v-for="(plan, index) in sortedPlans" :key="index" class="plan-item">
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="plan-actions">
              <button @click="editPlan(index)" class="edit-btn">编辑</button>
              <button @click="deletePlan(index)" class="delete-btn">删除</button>
            </div>
          </div>
          <p class="plan-time">
            {{ formatDate(plan.date) }} {{ getWeekday(plan.date) }}
          </p>
          <p>内容：{{ plan.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingPlan',
  data() {
    return {
      showAddForm: false,
      editingIndex: null,
      newPlan: {
        name: '',
        date: '',
        content: ''
      },
      plans: JSON.parse(localStorage.getItem('trainingPlans')) || []
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },
    sortedPlans() {
      return [...this.plans].sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA - dateB
      })
    }
  },
  methods: {
    getWeekday(dateString) {
      if (!dateString) return ''
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const date = new Date(dateString)
      return weekdays[date.getDay()]
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    savePlan() {
      if (!this.newPlan.name || !this.newPlan.date || !this.newPlan.content) {
        alert('请填写完整信息')
        return
      }

      if (this.editingIndex !== null) {
        // 编辑现有计划
        this.plans[this.editingIndex] = {...this.newPlan}
      } else {
        // 添加新计划
        this.plans.push({...this.newPlan})
      }

      localStorage.setItem('trainingPlans', JSON.stringify(this.plans))
      this.resetForm()
    },
    cancelAdd() {
      this.resetForm()
    },
    resetForm() {
      this.newPlan = {
        name: '',
        date: '',
        content: ''
      }
      this.showAddForm = false
      this.editingIndex = null
    },
    deletePlan(index) {
      if (confirm('确定要删除这个训练计划吗？')) {
        this.plans.splice(index, 1)
        localStorage.setItem('trainingPlans', JSON.stringify(this.plans))
      }
    },
    editPlan(index) {
      this.editingIndex = index
      this.newPlan = {...this.plans[index]}
      this.showAddForm = true
    }
  }
}
</script>

<style scoped>
.training-plan {
  padding: 20px;
}

.add-plan-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weekday {
  color: #666;
  font-size: 14px;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.save-btn {
  background-color: #42b983;
}

.cancel-btn {
  background-color: #666;
}

.edit-btn {
  background-color: #ffc107;
  color: #000;
}

.delete-btn {
  background-color: #dc3545;
}

button {
  padding: 5px 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-actions {
  display: flex;
  gap: 10px;
}

textarea {
  min-height: 100px;
  padding: 8px;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.plan-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.plan-time {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}
</style> 