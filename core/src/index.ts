type Recipe = {
  name: string;
  nutrition: {calories: number; fat: number; carbs: number; protein: number};
  ingredients: Ingredients[];
  directions: string[];
};
console.log('hello');
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
      {id: 3, name: 'eggs', amount: 3, unit: 'unit'},
      {id: 5, name: 'cheese', amount: 1, unit: 'cup'},
      {id: 6, name: 'mushrooms', amount: 1, unit: 'cup'},
    ],
    directions: ['Mix ingredients', 'Cook in pan'],
  },
  {
    name: 'Salad',
    nutrition: {calories: 100, fat: 5, carbs: 10, protein: 5},
    ingredients: [
      {id: 7, name: 'lettuce', amount: 1, unit: 'cup'},
      {id: 8, name: 'tomato', amount: 1, unit: 'unit'},
      {id: 9, name: 'cucumber', amount: 1, unit: 'unit'},
    ],
    directions: ['Mix ingredients'],
  },
  {
    name: 'Spaghetti',
    nutrition: {calories: 400, fat: 10, carbs: 70, protein: 15},
    ingredients: [
      {id: 10, name: 'spaghetti', amount: 1, unit: 'box'},
      {id: 11, name: 'tomato sauce', amount: 1, unit: 'jar'},
      {id: 12, name: 'ground beef', amount: 1, unit: 'lb'},
    ],
    directions: ['Cook spaghetti', 'Heat sauce', 'Cook beef', 'Mix together'],
  },
  {
    name: 'Chicken Soup',
    nutrition: {calories: 150, fat: 5, carbs: 15, protein: 10},
    ingredients: [
      {id: 13, name: 'chicken', amount: 1, unit: 'lb'},
      {id: 14, name: 'carrots', amount: 2, unit: 'unit'},
      {id: 15, name: 'celery', amount: 2, unit: 'stalks'},
      {id: 16, name: 'onion', amount: 1, unit: 'unit'},
    ],
    directions: ['Cook chicken', 'Add vegetables', 'Simmer'],
  },
  {
    name: 'Beef Stew',
    nutrition: {calories: 350, fat: 15, carbs: 30, protein: 20},
    ingredients: [
      {id: 17, name: 'beef', amount: 1, unit: 'lb'},
      {id: 18, name: 'potatoes', amount: 2, unit: 'unit'},
      {id: 19, name: 'carrots', amount: 2, unit: 'unit'},
      {id: 20, name: 'onion', amount: 1, unit: 'unit'},
    ],
    directions: ['Cook beef', 'Add vegetables', 'Simmer'],
  },
  {
    name: 'Tacos',
    nutrition: {calories: 200, fat: 10, carbs: 20, protein: 10},
    ingredients: [
      {id: 21, name: 'taco shells', amount: 10, unit: 'unit'},
      {id: 12, name: 'ground beef', amount: 1, unit: 'lb'},
      {id: 5, name: 'cheese', amount: 1, unit: 'cup'},
      {id: 7, name: 'lettuce', amount: 1, unit: 'cup'},
      {id: 8, name: 'tomato', amount: 1, unit: 'unit'},
    ],
    directions: ['Cook beef', 'Assemble tacos'],
  },
];

function getMenu(maxCalories: number, proteinGoal: number, recipes: Recipe[]) {
  const menu: Recipe[] = [];
  let calories = 0;
  let protein = 0;
  for (let i = 0; i < recipes.length; i++) {
    if (
      calories + recipes[i].nutrition.calories <= maxCalories &&
      protein <= proteinGoal
    ) {
      menu.push(recipes[i]);
      calories += recipes[i].nutrition.calories;
      protein += recipes[i].nutrition.protein;
    }
  }
  return menu;
}

const testCases = [
  {maxCalories: 1000, proteinGoal: 50},
  {maxCalories: 1500, proteinGoal: 75},
  {maxCalories: 2000, proteinGoal: 100},
];

testCases.forEach(testCase => {
  console.log(
    `Menu for ${testCase.maxCalories} calories and ${testCase.proteinGoal}g protein:`
  );
  const menu = getMenu(testCase.maxCalories, testCase.proteinGoal, recipes);
  const protein = menu.reduce(
    (acc, recipe) => acc + recipe.nutrition.protein,
    0
  );
  const calories = menu.reduce(
    (acc, recipe) => acc + recipe.nutrition.calories,
    0
  );
  console.log(`Total calories: ${calories}`);
  console.log(`Total protein: ${protein}g`);
  menu.forEach(recipe => {
    console.log(recipe.name);
  });
});
