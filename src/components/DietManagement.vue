<template>
  <div class="diet-management">
    <h2>饮食管理</h2>
    <div class="diet-container">
      <!-- 添加新食物按钮 -->
      <div class="add-food-button">
        <button @click="showAddFoodForm = true" class="add-food-btn">添加新食物</button>
        <button @click="showFoodLibrary = true" class="view-library-btn">查看食物库</button>
      </div>

      <!-- 添加新食物的弹窗表单 -->
      <div v-if="showAddFoodForm" class="add-food-modal">
        <div class="add-food-content">
          <h3>添加新食物</h3>
          <div class="form-group">
            <label>食物名称</label>
            <input 
              type="text" 
              v-model="newFood.name" 
              placeholder="输入食物名称"
              @input="searchNutrition"
            >
            <!-- 添加营养搜索结果 -->
            <div v-if="nutritionResults.length > 0" class="nutrition-results">
              <div 
                v-for="result in nutritionResults" 
                :key="result.id"
                class="nutrition-item"
                @click="selectNutrition(result)"
              >
                <span>{{ result.name }}</span>
                <span>{{ result.calories }}卡路里/{{ result.unit }}</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>单位</label>
            <select v-model="newFood.unitType">
              <option value="g">克(g)</option>
              <option value="个">个</option>
              <option value="ml">毫升(ml)</option>
            </select>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="newFood.category">
              <option v-for="category in foodCategories" 
                      :key="category.value" 
                      :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button @click="addNewFood" class="confirm-btn">确认添加</button>
            <button @click="showAddFoodForm = false" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>

      <!-- 添加食物库弹窗 -->
      <div v-if="showFoodLibrary" class="food-library-modal">
        <div class="food-library-content">
          <div class="library-header">
            <h3>食物库</h3>
            <input 
              type="text" 
              v-model="foodLibraryFilter" 
              placeholder="搜索食物..."
              class="library-search"
            >
          </div>

          <div class="library-categories">
            <div v-for="category in foodCategories" :key="category.value" class="category-section">
              <h4>{{ category.label }}</h4>
              <div class="food-list">
                <div 
                  v-for="food in filteredFoodLibrary(category.value)" 
                  :key="food.id" 
                  class="library-food-item"
                >
                  <div class="food-info">
                    <span class="food-name">{{ food.name }}</span>
                    <span class="food-calories">{{ food.calories }}卡路里/{{ food.unit }}</span>
                  </div>
                  <div class="food-nutrition">
                    <span>碳水: {{ food.nutrition.carbs }}g</span>
                    <span>蛋白质: {{ food.nutrition.protein }}g</span>
                    <span>脂肪: {{ food.nutrition.fat }}g</span>
                  </div>
                  <div class="food-actions">
                    <button @click.stop="selectFromLibrary(food)" class="select-btn">
                      选择
                    </button>
                    <button 
                      @click.stop="deleteFood(food.id)" 
                      class="delete-btn"
                      v-if="!isDefaultFood(food.id)"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="library-footer">
            <button @click="showFoodLibrary = false" class="close-btn">关闭</button>
          </div>
        </div>
      </div>

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
                <div class="food-item-info">
                  <span class="food-name">{{ food.name }}</span>
                  <span class="food-category">{{ food.category }}</span>
                </div>
                <span class="food-calories">{{ food.calories }}卡路里/{{ food.unit }}</span>
              </div>
            </div>
          </div>
          <select v-model="selectedType">
            <option value="breakfast">早餐</option>
            <option value="lunch">午餐</option>
            <option value="dinner">晚餐</option>
            <option value="snack">零食</option>
          </select>
        </div>

        <!-- 已选食物列表 -->
        <div class="selected-foods" v-if="selectedFoods.length > 0">
          <h3>已选食物</h3>
          <div class="selected-food-list">
            <div v-for="(item, index) in selectedFoods" 
                 :key="index" 
                 class="selected-food-item">
              <div class="food-info">
                <span class="food-name">{{ item.food }}</span>
                <div class="quantity-input">
                  <input 
                    type="number" 
                    v-model="item.quantity" 
                    placeholder="数量" 
                    min="0"
                    step="1"
                    @input="updateCalories(index)"
                  />
                  <span class="unit">{{ item.unit }}</span>
                </div>
                <span class="calories">{{ item.calories }} 卡路里</span>
              </div>
              <button @click="removeSelectedFood(index)" class="remove-btn">删除</button>
            </div>
          </div>
          <div class="selected-foods-actions">
            <button @click="addAllMeals" class="add-all-btn">添加所有</button>
            <button @click="clearSelectedFoods" class="clear-btn">清空</button>
          </div>
        </div>
      </div>

      <!-- 今日摄入总计 -->
      <div class="meal-summary">
        <h3>今日摄入总计: {{ totalCalories }} 卡路里</h3>
      </div>

      <!-- 今日饮食列表 -->
      <div class="meal-list">
        <div v-for="type in mealTypes" :key="type.value" class="meal-section">
          <h3>{{ type.label }}</h3>
          <div v-for="(meal, index) in getMealsByType(type.value)" 
               :key="index" 
               class="meal-item">
            <div class="meal-info">
              <span 
                class="food-name" 
                @mouseover="showNutritionTooltip($event, meal)"
                @mouseleave="hideNutritionTooltip"
              >
                {{ meal.food }}
                <div v-if="hoveredMeal === meal" class="nutrition-tooltip">
                  <div class="tooltip-title">营养成分</div>
                  <div class="tooltip-content">
                    <div class="tooltip-item">
                      <span>碳水化合物:</span>
                      <span>{{ formatNutrition(getFoodNutrition(meal.food, 'carbs', meal.quantity)) }}g</span>
                    </div>
                    <div class="tooltip-item">
                      <span>蛋白质:</span>
                      <span>{{ formatNutrition(getFoodNutrition(meal.food, 'protein', meal.quantity)) }}g</span>
                    </div>
                    <div class="tooltip-item">
                      <span>脂肪:</span>
                      <span>{{ formatNutrition(getFoodNutrition(meal.food, 'fat', meal.quantity)) }}g</span>
                    </div>
                    <div class="tooltip-item">
                      <span>维生素总量:</span>
                      <span>{{ formatNutrition(getFoodNutrition(meal.food, 'vitamins', meal.quantity), 2) }}mg</span>
                    </div>
                  </div>
                </div>
              </span>
              <span class="quantity">{{ meal.quantity }}{{ meal.unit }}</span>
              <span class="calories">{{ meal.calories }} 卡路里</span>
            </div>
            <div class="meal-actions">
              <button @click="deleteMeal(meal)" class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 历史记录部分移到最下面 -->
      <div class="history-view">
        <h3>饮食历史记录</h3>
        <div class="date-selector">
          <button @click="previousDay">←</button>
          <input 
            type="date" 
            v-model="selectedDate"
            :max="today"
          >
          <button @click="nextDay" :disabled="isToday">→</button>
        </div>

        <div class="daily-summary">
          <div class="total-calories">
            <span>当日总卡路里: {{ getDayTotalCalories }} 卡路里</span>
          </div>
          
          <div class="meal-history">
            <div v-for="type in mealTypes" :key="type.value" class="meal-period">
              <h4>{{ type.label }}</h4>
              <div class="meal-details" v-if="getMealsByTypeAndDate(type.value).length">
                <div v-for="(meal, index) in getMealsByTypeAndDate(type.value)" 
                     :key="index" 
                     class="history-meal-item">
                  <div class="meal-content">
                    <span class="food-name">{{ meal.food }}</span>
                    <span class="quantity">{{ meal.quantity }}{{ meal.unit }}</span>
                    <span class="calories">{{ meal.calories }}卡路里</span>
                  </div>
                </div>
              </div>
              <div v-else class="no-meals">
                暂无记录
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 在 history-view 后添加营养分析报告 -->
      <div class="nutrition-report">
        <h3>营养分析报告</h3>
        
        <!-- 营养素分布 -->
        <div class="nutrition-distribution">
          <h4>营养素分布</h4>
          <div class="nutrition-categories">
            <div class="nutrition-category">
              <div class="category-label">碳水化合物</div>
              <div class="category-value">{{ getNutritionPercentage('carbs') }}%</div>
              <div class="category-amount">{{ getNutritionAmount('carbs').toFixed(1) }}g</div>
            </div>
            <div class="nutrition-category">
              <div class="category-label">蛋白质</div>
              <div class="category-value">{{ getNutritionPercentage('protein') }}%</div>
              <div class="category-amount">{{ getNutritionAmount('protein').toFixed(1) }}g</div>
            </div>
            <div class="nutrition-category">
              <div class="category-label">脂肪</div>
              <div class="category-value">{{ getNutritionPercentage('fat') }}%</div>
              <div class="category-amount">{{ getNutritionAmount('fat').toFixed(1) }}g</div>
            </div>
            <div class="nutrition-category">
              <div class="category-label">维生素</div>
              <div class="category-value">{{ getNutritionPercentage('vitamins') }}%</div>
              <div class="category-amount">{{ getNutritionAmount('vitamins').toFixed(1) }}mg</div>
            </div>
          </div>
        </div>

        <!-- 饮食建议 -->
        <div class="nutrition-advice">
          <h4>今日饮食建议</h4>
          <ul class="advice-list">
            <li v-for="(advice, index) in dietaryAdvice" :key="index">
              {{ advice }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NUTRITION_REFERENCE, FOOD_CATEGORIES, NUTRITION_RANGES } from '../data/nutritionDatabase';

export default {
  name: 'DietManagement',
  data() {
    return {
      searchQuery: '',
      showResults: false,
      selectedType: 'breakfast',
      selectedFoods: [], // 存储已选择的食物
      meals: JSON.parse(localStorage.getItem('meals')) || [],
      mealTypes: [
        { value: 'breakfast', label: '早餐' },
        { value: 'lunch', label: '午餐' },
        { value: 'dinner', label: '晚餐' },
        { value: 'snack', label: '零食' }
      ],
      showAddFoodForm: false,
      newFood: {
        name: '',
        unitType: 'g',
        category: '主食'
      },
      foodDatabase: NUTRITION_REFERENCE.foodDatabase,
      dailyReference: NUTRITION_REFERENCE.dailyReference,
      foodCategories: FOOD_CATEGORIES,
      nutritionRanges: NUTRITION_RANGES,
      nutritionResults: [],
      nutritionSearchTimeout: null,
      apiKey: 'YOUR_API_KEY', // 需要替换为实际的 API key
      selectedDate: new Date().toISOString().split('T')[0],
      hoveredMeal: null,
      showFoodLibrary: false, // 控制食物库显示
      foodLibraryFilter: '', // 食物库搜索过滤
    }
  },
  computed: {
    totalCalories() {
      return this.getTodayMeals().reduce((total, meal) => total + Number(meal.calories), 0)
    },
    categorizedFoods() {
      const categories = {};
      this.foodDatabase.forEach(food => {
        if (!categories[food.category]) {
          categories[food.category] = [];
        }
        categories[food.category].push(food);
      });
      return categories;
    },
    filteredFoods() {
      if (!this.searchQuery) return [];
      return this.foodDatabase.filter(food => {
        if (!food || typeof food.name !== 'string') return false;
        
        const searchLower = this.searchQuery.toLowerCase();
        const nameMatch = food.name.toLowerCase().includes(searchLower);
        const categoryMatch = food.category && 
                            typeof food.category === 'string' && 
                            food.category.toLowerCase().includes(searchLower);
        
        return nameMatch || categoryMatch;
      });
    },
    today() {
      return new Date().toISOString().split('T')[0]
    },
    isToday() {
      return this.selectedDate === this.today
    },
    getDayTotalCalories() {
      return this.getMealsByDate(this.selectedDate)
        .reduce((total, meal) => total + Number(meal.calories), 0)
    },
    dietaryAdvice() {
      const advice = [];
      
      // 检查各营养素摄入情况
      for (const nutrient of ['carbs', 'protein', 'fat']) {
        const percentage = this.getNutritionPercentage(nutrient);
        const nutrientAdvice = this.getNutritionAdvice(nutrient, percentage);
        if (nutrientAdvice) {
          advice.push(nutrientAdvice);
        }
      }

      // 检查维生素摄入
      const vitaminPercentage = this.checkDailyIntake('vitamins');
      if (vitaminPercentage < 80) {
        advice.push('维生素摄入不足，建议增加新鲜蔬果的摄入。');
      }

      if (advice.length === 0) {
        advice.push('今日营养素摄入比例合理，请继续保持！');
      }

      return advice;
    }
  },
  methods: {
    selectFood(food) {
      // 安全地提取数字
      let baseUnit = 100;  // 默认值
      if (food.unit === '个') {
        baseUnit = 1;
      } else {
        const match = food.unit.match(/\d+/);
        if (match && match[0]) {
          baseUnit = parseInt(match[0]);
        }
      }
      
      // 深拷贝食物的营养信息
      const nutrition = food.nutrition ? {
        carbs: food.nutrition.carbs || 0,
        protein: food.nutrition.protein || 0,
        fat: food.nutrition.fat || 0,
        vitamins: { ...food.nutrition.vitamins } || {}
      } : {
        carbs: 0,
        protein: 0,
        fat: 0,
        vitamins: {}
      };

      this.selectedFoods.push({
        food: food.name,
        quantity: '',
        unit: food.unit.replace(/\d+/g, '').trim(),
        calories: 0,
        type: this.selectedType,
        baseCalories: food.calories,
        baseUnit: baseUnit,
        date: new Date().toISOString().split('T')[0],
        nutrition: nutrition  // 使用深拷贝的营养信息
      });

      this.showResults = false;
      this.searchQuery = '';
    },
    updateCalories(index) {
      const food = this.selectedFoods[index];
      if (!food.quantity) {
        food.calories = 0;
        return;
      }
      // 修正卡路里计算
      const ratio = food.quantity / food.baseUnit;
      food.calories = Math.round(food.baseCalories * ratio);
    },
    removeSelectedFood(index) {
      this.selectedFoods.splice(index, 1)
    },
    clearSelectedFoods() {
      if (confirm('确定要清空所有已选食物吗？')) {
        this.selectedFoods = []
      }
    },
    addAllMeals() {
      if (!this.selectedFoods.length) {
        alert('请先选择食物');
        return;
      }

      const invalidFoods = this.selectedFoods.filter(food => !food.quantity || food.quantity <= 0);
      if (invalidFoods.length) {
        alert('请填写所有食物的数量');
        return;
      }

      // 添加所有选择的食物，确保包含完整的营养信息
      const mealsToAdd = this.selectedFoods.map(food => {
        // 从数据库中获取完整的食物信息
        const foodData = this.foodDatabase.find(f => f.name === food.food);
        
        // 确保营养信息被正确复制
        const nutrition = foodData?.nutrition ? {
          carbs: foodData.nutrition.carbs || 0,
          protein: foodData.nutrition.protein || 0,
          fat: foodData.nutrition.fat || 0,
          vitamins: { ...foodData.nutrition.vitamins }
        } : {
          carbs: 0,
          protein: 0,
          fat: 0,
          vitamins: {}
        };

        return {
          ...food,
          nutrition: nutrition
        };
      });

      this.meals.push(...mealsToAdd);
      
      // 保存到 localStorage 时确保所有数据都被正确序列化
      localStorage.setItem('meals', JSON.stringify(this.meals));
      
      this.selectedFoods = [];
      alert('添加成功');
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
    searchNutrition(event) {
      const query = event.target.value.trim();
      if (!query) {
        this.nutritionResults = [];
        return;
      }

      // 在营养数据库中搜索匹配的食物
      this.nutritionResults = NUTRITION_REFERENCE.foodDatabase
        .filter(food => food.name.includes(query))
        .slice(0, 5); // 限制显示前5个结果
    },
    selectNutrition(food) {
      this.newFood = {
        name: food.name,
        calories: food.calories,
        unitType: food.unit.includes('ml') ? 'ml' : 
                  food.unit.includes('个') ? '个' : 'g',
        category: food.category
      };
      this.nutritionResults = []; // 清空搜索结果
    },
    addNewFood() {
      if (!this.newFood.name || !this.newFood.calories) {
        alert('请填写完整信息');
        return;
      }

      // 检查是否存在同名食物
      const existingFood = NUTRITION_REFERENCE.foodDatabase.find(
        food => food.name === this.newFood.name
      );
      if (existingFood) {
        alert('该食物已存在');
        return;
      }

      // 创建新食物对象
      const newFoodItem = {
        id: NUTRITION_REFERENCE.foodDatabase.length + 1,
        name: this.newFood.name,
        calories: Number(this.newFood.calories),
        unit: this.newFood.unitType === 'g' ? '100g' : 
              this.newFood.unitType === 'ml' ? '100ml' : '个',
        category: this.newFood.category,
        nutrition: {
          carbs: 0,
          protein: 0,
          fat: 0,
          vitamins: {}
        }
      };

      // 直接更新 NUTRITION_REFERENCE
      NUTRITION_REFERENCE.foodDatabase.push(newFoodItem);
      
      // 重置表单并关闭
      this.newFood = {
        name: '',
        calories: '',
        unitType: 'g',
        category: '主食'
      };
      this.showAddFoodForm = false;
      alert('添加成功');
    },
    previousDay() {
      const date = new Date(this.selectedDate)
      date.setDate(date.getDate() - 1)
      this.selectedDate = date.toISOString().split('T')[0]
    },
    nextDay() {
      const date = new Date(this.selectedDate)
      date.setDate(date.getDate() + 1)
      const newDate = date.toISOString().split('T')[0]
      if (newDate <= this.today) {
        this.selectedDate = newDate
      }
    },
    getMealsByDate(date) {
      return this.meals.filter(meal => meal.date === date)
    },
    getMealsByTypeAndDate(type) {
      return this.getMealsByDate(this.selectedDate)
        .filter(meal => meal.type === type)
    },
    getNutritionAmount(nutrientType) {
      // 获取当前日期的所有餐食
      const dayMeals = this.getMealsByDate(this.selectedDate);
      
      // 计算总营养量
      return dayMeals.reduce((total, meal) => {
        // 从数据库中找到对应的食物
        const food = this.foodDatabase.find(f => f.name === meal.food);
        if (!food || !food.nutrition) return total;

        // 计算实际摄入量的比例
        const quantity = Number(meal.quantity) || 0;
        const baseUnit = parseInt(food.unit.match(/\d+/)?.[0] || 100);
        const ratio = quantity / baseUnit;

        // 根据营养素类型返回对应的值
        switch (nutrientType) {
          case 'carbs':
            return total + ((food.nutrition.carbs || 0) * ratio);
          case 'protein':
            return total + ((food.nutrition.protein || 0) * ratio);
          case 'fat':
            return total + ((food.nutrition.fat || 0) * ratio);
          case 'vitamins': {
            const vitamins = food.nutrition.vitamins || {};
            const vitaminTotal = Object.values(vitamins).reduce((sum, v) => sum + (v || 0), 0);
            return total + (vitaminTotal * ratio);
          }
          default:
            return total;
        }
      }, 0);
    },
    getNutritionPercentage(nutrientType) {
      // 获取当前营养素的总量
      const currentNutrient = this.getNutritionAmount(nutrientType);
      
      // 计算总宏量营养素（碳水、蛋白质、脂肪）
      const totalMacronutrients = 
        this.getNutritionAmount('carbs') + 
        this.getNutritionAmount('protein') + 
        this.getNutritionAmount('fat');

      // 对于维生素，使用每日推荐摄入量作为基准
      if (nutrientType === 'vitamins') {
        return Math.round((currentNutrient / this.dailyReference.vitamins.total) * 100) || 0;
      }

      // 对于其他营养素，计算它们在总量中的占比
      if (totalMacronutrients === 0) return 0;
      return Math.round((currentNutrient / totalMacronutrients) * 100);
    },
    getOtherNutritionPercentage() {
      const mainCategories = ['主食', '蛋白质', '蔬菜', '水果'];
      const otherCalories = this.getMealsByDate(this.selectedDate).filter(meal => {
        const food = this.foodDatabase.find(f => f.name === meal.food);
        return food && !mainCategories.includes(food.category);
      }).reduce((sum, meal) => sum + Number(meal.calories), 0);

      const dayTotal = this.getDayTotalCalories;
      return dayTotal ? Math.round((otherCalories / dayTotal) * 100) : 0;
    },
    showNutritionTooltip(event, meal) {
      this.hoveredMeal = meal;
    },
    hideNutritionTooltip() {
      this.hoveredMeal = null;
    },
    getFoodNutrition(foodName, nutrientType, quantity) {
      // 从数据库中找到对应的食物
      const food = this.foodDatabase.find(f => f.name === foodName);
      if (!food) {
        console.warn(`Food not found: ${foodName}`);
        return 0;
      }
      
      if (!food.nutrition) {
        console.warn(`No nutrition info for: ${foodName}`);
        return 0;
      }

      // 计算比例
      let baseUnit = 100;  // 默认值
      if (food.unit === '个') {
        baseUnit = 1;
      } else {
        const match = food.unit.match(/\d+/);
        if (match && match[0]) {
          baseUnit = parseInt(match[0]);
        }
      }

      const qty = Number(quantity) || 0;
      const ratio = qty / baseUnit;

      // 添加调试信息
      console.log(`Calculating nutrition for ${foodName}:`, {
        nutrientType,
        quantity: qty,
        baseUnit,
        ratio,
        nutrition: food.nutrition
      });

      // 根据营养素类型返回对应的值
      switch (nutrientType) {
        case 'carbs':
          return (food.nutrition.carbs || 0) * ratio;
        case 'protein':
          return (food.nutrition.protein || 0) * ratio;
        case 'fat':
          return (food.nutrition.fat || 0) * ratio;
        case 'vitamins': {
          const vitamins = food.nutrition.vitamins || {};
          const vitaminTotal = Object.values(vitamins).reduce((sum, v) => sum + (v || 0), 0);
          return vitaminTotal * ratio;
        }
        default:
          return 0;
      }
    },
    calculateVitaminTotal(vitamins = {}, ratio) {
      return Object.values(vitamins)
        .reduce((sum, v) => sum + (v || 0), 0) * ratio;
    },
    getNutritionAdvice(nutrientType, percentage) {
      const range = this.nutritionRanges[nutrientType];
      if (!range) return '';
      
      if (percentage < range.min) {
        return range.advice.low;
      } else if (percentage > range.max) {
        return range.advice.high;
      }
      return range.advice.normal;
    },
    checkDailyIntake(nutrientType) {
      const current = this.getNutritionAmount(nutrientType);
      const reference = this.dailyReference[nutrientType];
      return (current / reference) * 100;
    },
    formatNutrition(value, decimals = 1) {
      if (value === 0) return '0';
      if (value < 0.01) return '< 0.01';
      return value.toFixed(decimals);
    },
    filteredFoodLibrary(category) {
      return this.foodDatabase.filter(food => {
        const matchesCategory = food.category === category;
        const matchesSearch = !this.foodLibraryFilter || 
          food.name.toLowerCase().includes(this.foodLibraryFilter.toLowerCase());
        return matchesCategory && matchesSearch;
      }).sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序
    },
    selectFromLibrary(food) {
      this.selectFood({
        name: food.name,
        calories: food.calories,
        unit: food.unit,
        category: food.category,
        nutrition: { ...food.nutrition },
        baseCalories: food.calories,
        baseUnit: parseInt(food.unit.match(/\d+/)?.[0] || 1)
      });
      this.showFoodLibrary = false;
    },
    deleteFood(foodId) {
      const index = NUTRITION_REFERENCE.foodDatabase.findIndex(
        food => food.id === foodId
      );
      if (index > -1) {
        // 确保该食物没有被使用
        const isUsed = this.meals.some(meal => meal.food === NUTRITION_REFERENCE.foodDatabase[index].name);
        if (isUsed) {
          alert('该食物已被使用，无法删除');
          return;
        }
        
        // 从数据库中删除
        NUTRITION_REFERENCE.foodDatabase.splice(index, 1);
        alert('删除成功');
      }
    },
    isDefaultFood(foodId) {
      // 假设 ID 小于等于 19 的是默认食物（根据你的数据库实际情况调整）
      return foodId <= 19;
    }
  },
  watch: {
    'NUTRITION_REFERENCE.foodDatabase': {
      handler(newValue) {
        this.foodDatabase = newValue;
      },
      deep: true
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
  align-items: center;
}

.food-name {
  min-width: 150px;
  position: relative;
  cursor: pointer;
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
  align-items: center;
}

.food-item:hover {
  background-color: #f8f9fa;
}

.food-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.food-category {
  font-size: 12px;
  color: #666;
}

.food-calories {
  color: #42b983;
  font-weight: 500;
}

.quantity-input {
  display: flex;
  align-items: center;
  gap: 5px;
}

.unit {
  color: #666;
  white-space: nowrap;
}

.quantity {
  color: #666;
  min-width: 80px;
}

.selected-foods {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.selected-food-list {
  margin-top: 10px;
}

.selected-food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.food-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.selected-foods-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.add-all-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.add-food-button {
  margin-bottom: 15px;
}

.add-food-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.add-food-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-food-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.nutrition-results {
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

.nutrition-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.nutrition-item:hover {
  background-color: #f8f9fa;
}

.history-view {
  margin-top: 0;  /* 移除顶部边距 */
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.date-selector input[type="date"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.date-selector button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.date-selector button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.daily-summary {
  margin-top: 20px;
}

.total-calories {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: bold;
}

.meal-period {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.meal-period h4 {
  margin: 0 0 10px 0;
  color: #42b983;
}

.history-meal-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.meal-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-meals {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 10px;
}

.meal-details {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
}

/* 添加分隔线样式 */
.divider {
  margin: 40px 0;
  border-top: 2px solid #eee;
}

/* 修改历史记录标题样式 */
.history-view h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.nutrition-report {
  margin-top: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nutrition-report h3 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.nutrition-distribution {
  margin-bottom: 30px;
}

.nutrition-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.nutrition-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.category-label {
  color: #666;
  margin-bottom: 5px;
}

.category-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #42b983;
}

.category-amount {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.nutrition-advice {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.advice-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.advice-list li {
  padding: 8px 0;
  color: #666;
  border-bottom: 1px solid #eee;
}

.advice-list li:last-child {
  border-bottom: none;
}

.nutrition-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
  margin-top: 5px;
}

.tooltip-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.tooltip-item span:first-child {
  margin-right: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-library-btn {
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.food-library-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.food-library-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.library-search {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.library-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.category-section h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.1em;
  padding-bottom: 5px;
  border-bottom: 2px solid #42b983;
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.library-food-item {
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  position: relative;
}

.library-food-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.food-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.food-nutrition {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
  color: #666;
}

.food-name {
  font-weight: 500;
  color: #2c3e50;
}

.food-calories {
  color: #42b983;
  font-weight: 500;
}

.library-footer {
  margin-top: 20px;
  text-align: right;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
}

.food-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.library-food-item:hover .food-actions {
  opacity: 1;
}

.select-btn {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}
</style> 