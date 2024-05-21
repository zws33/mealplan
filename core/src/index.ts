type Recipe = {
  name: string;
  nutrition: {calories: number; fat: number; carbs: number; protein: number};
  ingredients: Ingredients[];
  directions: string[];
};

type Ingredients = {
  id: number;
  name: string;
  amount: number;
  unit: string;
};

const recipes: Recipe[] = [
  {
    name: 'Pancakes',
    nutrition: {calories: 250, fat: 10, carbs: 30, protein: 10},
    ingredients: [
      {id: 1, name: 'flour', amount: 1, unit: 'cup'},
      {id: 2, name: 'milk', amount: 1, unit: 'cup'},
      {id: 3, name: 'eggs', amount: 2, unit: 'unit'},
    ],
    directions: ['Mix ingredients', 'Cook on griddle'],
  },
  {
    name: 'Omelette',
    nutrition: {calories: 200, fat: 10, carbs: 5, protein: 20},
    ingredients: [
      {id: 4, name: 'eggs', amount: 3, unit: 'unit'},
      {id: 5, name: 'cheese', amount: 1, unit: 'cup'},
      {id: 6, name: 'mushrooms', amount: 1, unit: 'cup'},
    ],
    directions: ['Mix ingredients', 'Cook in pan'],
  },
];
