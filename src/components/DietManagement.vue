<template>
  <div class="diet-management">
    <h2>饮食管理</h2>
    <div class="diet-container">
      <div class="meal-input">
        <div class="input-group">
          <div class="food-search">
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="searchFood" 
              placeholder="搜索食物..." 
            />
            <div v-if="showResults" class="search-results">
              <div 
                v-for="food in filteredFoods" 
                :key="food.id" 
                class="food-item"
                @click="selectFood(food)"
              >
                <span>{{ food.name }}</span>
                <span>{{ food.calories }}卡路里/100g</span>
              </div>
            </div>
          </div>
          <input type="number" v-model="newMeal.calories" placeholder="卡路里" />
          <select v-model="newMeal.type">
            <option value="breakfast">早餐</option>
            <option value="lunch">午餐</option>
            <option value="dinner">晚餐</option>
            <option value="snack">零食</option>
          </select>
          <button @click="addMeal" class="add-btn">添加</button>
        </div>
      </div>

      <div class="meal-summary">
        <h3>今日摄入总计: {{ totalCalories }} 卡路里</h3>
      </div>

      <div class="meal-list">
        <div v-for="type in mealTypes" :key="type.value" class="meal-section">
          <h3>{{ type.label }}</h3>
          <div v-for="(meal, index) in getMealsByType(type.value)" 
               :key="index" 
               class="meal-item">
            <div class="meal-info">
              <span class="food-name">{{ meal.food }}</span>
              <span class="calories">{{ meal.calories }} 卡路里</span>
            </div>
            <div class="meal-actions">
              <button @click="deleteMeal(meal)" class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DietManagement',
  data() {
    return {
      newMeal: {
        food: '',
        calories: '',
        type: 'breakfast',
        date: new Date().toISOString().split('T')[0]
      },
      meals: JSON.parse(localStorage.getItem('meals')) || [],
      mealTypes: [
        { value: 'breakfast', label: '早餐' },
        { value: 'lunch', label: '午餐' },
        { value: 'dinner', label: '晚餐' },
        { value: 'snack', label: '零食' }
      ],
      searchQuery: '',
      showResults: false,
      selectedFood: null,
      foodDatabase: [
        { id: 1, name: '米饭', calories: 116, unit: '100g' },
        { id: 2, name: '鸡胸肉', calories: 165, unit: '100g' },
        { id: 3, name: '西兰花', calories: 55, unit: '100g' },
        { id: 4, name: '鸡蛋', calories: 155, unit: '100g' },
        { id: 5, name: '牛奶', calories: 42, unit: '100ml' },
        // 可以添加更多食物
      ]
    }
  },
  computed: {
    totalCalories() {
      return this.getTodayMeals().reduce((total, meal) => total + Number(meal.calories), 0)
    },
    filteredFoods() {
      if (!this.searchQuery) return []
      return this.foodDatabase.filter(food =>
        food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    addMeal() {
      if (this.newMeal.food && this.newMeal.calories) {
        this.meals.push({...this.newMeal})
        localStorage.setItem('meals', JSON.stringify(this.meals))
        this.newMeal.food = ''
        this.newMeal.calories = ''
      } else {
        alert('请填写完整信息')
      }
    },
    deleteMeal(meal) {
      const index = this.meals.indexOf(meal)
      if (index > -1) {
        this.meals.splice(index, 1)
        localStorage.setItem('meals', JSON.stringify(this.meals))
      }
    },
    getTodayMeals() {
      const today = new Date().toISOString().split('T')[0]
      return this.meals.filter(meal => meal.date === today)
    },
    getMealsByType(type) {
      return this.getTodayMeals().filter(meal => meal.type === type)
    },
    searchFood() {
      this.showResults = true
    },
    selectFood(food) {
      this.newMeal.food = food.name
      this.newMeal.calories = food.calories
      this.showResults = false
      this.searchQuery = ''
    }
  }
}
</script>

<style scoped>
.diet-management {
  padding: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.meal-summary {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.meal-section {
  margin-bottom: 20px;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.meal-info {
  display: flex;
  gap: 20px;
}

.food-name {
  min-width: 150px;
}

.calories {
  color: #666;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.food-search {
  position: relative;
  width: 100%;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.food-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.food-item:hover {
  background-color: #f8f9fa;
}
</style> 