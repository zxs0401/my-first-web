export const NUTRITION_REFERENCE = {
  // 中国居民膳食营养素参考摄入量(DRIs)
  dailyReference: {
    energy: 2250,      // kcal/天
    protein: 65,       // g/天
    carbs: 300,        // g/天
    fat: 60,           // g/天
    vitamins: {
      A: 0.8,          // mg/天
      D: 0.01,         // mg/天
      E: 14,           // mg/天
      K: 0.075,        // mg/天
      B1: 1.2,         // mg/天
      B2: 1.3,         // mg/天
      B6: 1.3,         // mg/天
      B12: 0.0024,     // mg/天
      C: 100,          // mg/天
    }
  },

  // 食物营养数据库
  foodDatabase: [
    {
      id: 1,
      name: '米饭(熟)',
      calories: 116,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 25.5,
        protein: 2.6,
        fat: 0.3,
        vitamins: { B1: 0.02, B2: 0.01, B6: 0.05 }
      }
    },
    {
      id: 2,
      name: '面包(全麦)',
      calories: 247,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 41.3,
        protein: 13.0,
        fat: 3.3,
        vitamins: { B1: 0.2, B2: 0.1, E: 0.6 }
      }
    },
    {
      id: 3,
      name: '燕麦片',
      calories: 389,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 66.3,
        protein: 16.9,
        fat: 6.9,
        vitamins: { B1: 0.76, B2: 0.14, E: 0.5 }
      }
    },
    {
      id: 4,
      name: '面条(熟)',
      calories: 138,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 25.0,
        protein: 4.5,
        fat: 2.1,
        vitamins: { B1: 0.1, B2: 0.05 }
      }
    },
    {
      id: 5,
      name: '馒头',
      calories: 223,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 48.5,
        protein: 7.0,
        fat: 0.6,
        vitamins: { B1: 0.16, B2: 0.08 }
      }
    },
    {
      id: 6,
      name: '玉米',
      calories: 112,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 22.1,
        protein: 3.8,
        fat: 1.2,
        vitamins: { B1: 0.15, B2: 0.12, C: 7 }
      }
    },
    {
      id: 7,
      name: '红薯',
      calories: 86,
      unit: '100g',
      category: '主食',
      nutrition: {
        carbs: 20.1,
        protein: 1.6,
        fat: 0.1,
        vitamins: { A: 14.187, C: 2.4 }
      }
    },
    {
      id: 8,
      name: '鸡胸肉(煮)',
      calories: 165,
      unit: '100g',
      category: '蛋白质',
      nutrition: {
        carbs: 0,
        protein: 31,
        fat: 3.6,
        vitamins: { B3: 13.7, B6: 0.6 }
      }
    },
    {
      id: 9,
      name: '鸡蛋',
      calories: 155,
      unit: '个',
      category: '蛋白质',
      nutrition: {
        carbs: 1.1,
        protein: 12.6,
        fat: 11.3,
        vitamins: { A: 0.16, D: 0.002, E: 1.05, B2: 0.5, B12: 0.0011 }
      }
    },
    {
      id: 10,
      name: '猪肉(瘦)',
      calories: 143,
      unit: '100g',
      category: '蛋白质',
      nutrition: {
        carbs: 0,
        protein: 20.3,
        fat: 6.2,
        vitamins: { B1: 0.87, B2: 0.23, B6: 0.45 }
      }
    },
    {
      id: 11,
      name: '三文鱼',
      calories: 208,
      unit: '100g',
      category: '蛋白质',
      nutrition: {
        carbs: 0,
        protein: 22.1,
        fat: 13.4,
        vitamins: { D: 0.011, B12: 0.003, B6: 0.98, E: 3.55 }
      }
    },
    {
      id: 12,
      name: '菠菜',
      calories: 23,
      unit: '100g',
      category: '蔬菜',
      nutrition: {
        carbs: 3.6,
        protein: 2.9,
        fat: 0.4,
        vitamins: { A: 9.377, C: 28.1, K: 0.483, E: 2.03 }
      }
    },
    {
      id: 13,
      name: '西红柿',
      calories: 18,
      unit: '100g',
      category: '蔬菜',
      nutrition: {
        carbs: 3.9,
        protein: 0.9,
        fat: 0.2,
        vitamins: { A: 0.833, C: 13.7, E: 0.54, K: 0.0079 }
      }
    },
    {
      id: 14,
      name: '橙子',
      calories: 47,
      unit: '100g',
      category: '水果',
      nutrition: {
        carbs: 11.8,
        protein: 0.9,
        fat: 0.1,
        vitamins: { C: 53.2, B1: 0.087, B6: 0.06, A: 0.225 }
      }
    },
    {
      id: 15,
      name: '草莓',
      calories: 32,
      unit: '100g',
      category: '水果',
      nutrition: {
        carbs: 7.7,
        protein: 0.7,
        fat: 0.3,
        vitamins: { C: 58.8, B6: 0.047, K: 0.0024 }
      }
    },
    {
      id: 16,
      name: '脱脂牛奶',
      calories: 34,
      unit: '100ml',
      category: '乳制品',
      nutrition: {
        carbs: 4.8,
        protein: 3.4,
        fat: 0.1,
        vitamins: { A: 0.028, D: 0.0011, B2: 0.15, B12: 0.0004 }
      }
    },
    {
      id: 17,
      name: '酸奶',
      calories: 56,
      unit: '100g',
      category: '乳制品',
      nutrition: {
        carbs: 4.7,
        protein: 3.5,
        fat: 3.3,
        vitamins: { A: 0.027, B2: 0.14, B12: 0.0004 }
      }
    },
    {
      id: 18,
      name: '杏仁',
      calories: 579,
      unit: '100g',
      category: '坚果',
      nutrition: {
        carbs: 21.7,
        protein: 21.2,
        fat: 49.9,
        vitamins: { E: 25.6, B2: 1.14, B1: 0.21 }
      }
    },
    {
      id: 19,
      name: '核桃',
      calories: 654,
      unit: '100g',
      category: '坚果',
      nutrition: {
        carbs: 13.7,
        protein: 15.2,
        fat: 65.2,
        vitamins: { E: 0.7, B1: 0.34, B6: 0.54 }
      }
    }
  ]
};

// 食物分类
export const FOOD_CATEGORIES = [
  { value: '主食', label: '主食类' },
  { value: '蛋白质', label: '蛋白质类' },
  { value: '蔬菜', label: '蔬菜类' },
  { value: '水果', label: '水果类' },
  { value: '乳制品', label: '乳制品类' },
  { value: '坚果', label: '坚果类' },
  { value: '饮料', label: '饮料类' },
  { value: '零食', label: '零食类' }
];

// 营养素建议范围
export const NUTRITION_RANGES = {
  carbs: {
    min: 45,  // 占总能量的45-65%
    max: 65,
    unit: '%',
    advice: {
      low: '碳水化合物摄入偏低，建议适当增加全谷物、薯类等主食的摄入。',
      high: '碳水化合物摄入偏高，建议控制主食摄入量。',
      normal: '碳水化合物摄入适中，请继续保持。'
    }
  },
  protein: {
    min: 10,  // 占总能量的10-35%
    max: 35,
    unit: '%',
    advice: {
      low: '蛋白质摄入不足，建议增加瘦肉、鱼、蛋、豆制品等食物的摄入。',
      high: '蛋白质摄入偏高，建议适当减少。',
      normal: '蛋白质摄入适中，请继续保持。'
    }
  },
  fat: {
    min: 20,  // 占总能量的20-35%
    max: 35,
    unit: '%',
    advice: {
      low: '脂肪摄入偏低，建议适量添加健康油脂。',
      high: '脂肪摄入偏高，建议控制油脂摄入。',
      normal: '脂肪摄入适中，请继续保持。'
    }
  }
}; 