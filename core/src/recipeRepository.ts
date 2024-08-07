import {Recipe} from './models/recipe';

export class RecipeRepository {
  constructor(private recipes: Recipe[]) {}
  getRecipes(): Recipe[] {
    return this.recipes;
  }
  static create(): RecipeRepository {
    return new RecipeRepository(recipes);
  }
}

const recipes: Recipe[] = [
  {
    id: 1,
    name: 'Spaghetti Bolognese',
    nutrition: {calories: 600, fat: 20, carbs: 80, protein: 30},
    ingredients: [
      {id: 1, name: 'Spaghetti', quantity: {unit: 'grams', scalar: 200}},
      {id: 2, name: 'Ground Beef', quantity: {unit: 'grams', scalar: 150}},
      {id: 3, name: 'Tomato Sauce', quantity: {unit: 'cups', scalar: 1}},
      {id: 4, name: 'Onion', quantity: {unit: 'units', scalar: 1}},
      {id: 5, name: 'Garlic', quantity: {unit: 'cloves', scalar: 2}},
    ],
    instructions: [
      {description: 'Cook spaghetti according to package instructions.'},
      {description: 'Brown ground beef in a pan.'},
      {
        description:
          'Add chopped onion and garlic to the pan and cook until soft.',
      },
      {description: 'Add tomato sauce and simmer for 20 minutes.'},
      {description: 'Serve sauce over spaghetti.'},
    ],
  },
  {
    id: 2,
    name: 'Chicken Salad',
    nutrition: {calories: 400, fat: 15, carbs: 20, protein: 35},
    ingredients: [
      {id: 6, name: 'Chicken Breast', quantity: {unit: 'grams', scalar: 200}},
      {id: 7, name: 'Lettuce', quantity: {unit: 'cups', scalar: 2}},
      {id: 8, name: 'Tomato', quantity: {unit: 'units', scalar: 1}},
      {id: 9, name: 'Cucumber', quantity: {unit: 'units', scalar: 1}},
      {id: 10, name: 'Olive Oil', quantity: {unit: 'tablespoons', scalar: 2}},
    ],
    instructions: [
      {description: 'Grill chicken breast until fully cooked.'},
      {description: 'Chop lettuce, tomato, and cucumber.'},
      {description: 'Slice grilled chicken and add to salad.'},
      {description: 'Drizzle with olive oil and toss to combine.'},
    ],
  },
  {
    id: 3,
    name: 'Beef Tacos',
    nutrition: {calories: 500, fat: 25, carbs: 50, protein: 20},
    ingredients: [
      {id: 11, name: 'Ground Beef', quantity: {unit: 'grams', scalar: 200}},
      {id: 12, name: 'Taco Shells', quantity: {unit: 'units', scalar: 4}},
      {id: 13, name: 'Cheese', quantity: {unit: 'grams', scalar: 50}},
      {id: 14, name: 'Lettuce', quantity: {unit: 'cups', scalar: 1}},
      {id: 15, name: 'Salsa', quantity: {unit: 'cups', scalar: 0.5}},
    ],
    instructions: [
      {description: 'Brown ground beef in a pan.'},
      {description: 'Fill taco shells with beef, cheese, lettuce, and salsa.'},
    ],
  },
  {
    id: 4,
    name: 'Vegetable Stir Fry',
    nutrition: {calories: 350, fat: 10, carbs: 50, protein: 10},
    ingredients: [
      {id: 16, name: 'Broccoli', quantity: {unit: 'cups', scalar: 2}},
      {id: 17, name: 'Carrot', quantity: {unit: 'units', scalar: 1}},
      {id: 18, name: 'Bell Pepper', quantity: {unit: 'units', scalar: 1}},
      {id: 19, name: 'Soy Sauce', quantity: {unit: 'tablespoons', scalar: 2}},
      {id: 20, name: 'Olive Oil', quantity: {unit: 'tablespoons', scalar: 1}},
    ],
    instructions: [
      {description: 'Chop all vegetables.'},
      {description: 'Heat olive oil in a pan.'},
      {description: 'Add vegetables to the pan and stir fry for 5-7 minutes.'},
      {description: 'Add soy sauce and cook for another 2 minutes.'},
    ],
  },
  {
    id: 5,
    name: 'Pancakes',
    nutrition: {calories: 300, fat: 10, carbs: 45, protein: 8},
    ingredients: [
      {id: 21, name: 'Flour', quantity: {unit: 'cups', scalar: 1}},
      {id: 22, name: 'Milk', quantity: {unit: 'cups', scalar: 1}},
      {id: 23, name: 'Egg', quantity: {unit: 'units', scalar: 1}},
      {id: 24, name: 'Baking Powder', quantity: {unit: 'teaspoons', scalar: 1}},
      {id: 25, name: 'Sugar', quantity: {unit: 'tablespoons', scalar: 1}},
    ],
    instructions: [
      {description: 'Mix all ingredients in a bowl.'},
      {description: 'Heat a non-stick pan over medium heat.'},
      {description: 'Pour batter into the pan and cook until bubbles form.'},
      {description: 'Flip and cook until golden brown.'},
    ],
  },
  {
    id: 6,
    name: 'Grilled Cheese Sandwich',
    nutrition: {calories: 400, fat: 20, carbs: 40, protein: 15},
    ingredients: [
      {id: 26, name: 'Bread', quantity: {unit: 'slices', scalar: 2}},
      {id: 27, name: 'Cheese', quantity: {unit: 'slices', scalar: 2}},
      {id: 28, name: 'Butter', quantity: {unit: 'tablespoons', scalar: 1}},
    ],
    instructions: [
      {description: 'Butter one side of each bread slice.'},
      {description: 'Place cheese between bread slices, buttered sides out.'},
      {
        description:
          'Heat a pan over medium heat and cook sandwich until golden brown on both sides.',
      },
    ],
  },
  {
    id: 7,
    name: 'Chicken Curry',
    nutrition: {calories: 500, fat: 20, carbs: 50, protein: 30},
    ingredients: [
      {id: 29, name: 'Chicken Breast', quantity: {unit: 'grams', scalar: 200}},
      {id: 30, name: 'Coconut Milk', quantity: {unit: 'cups', scalar: 1}},
      {
        id: 31,
        name: 'Curry Powder',
        quantity: {unit: 'tablespoons', scalar: 2},
      },
      {id: 32, name: 'Onion', quantity: {unit: 'units', scalar: 1}},
      {id: 33, name: 'Garlic', quantity: {unit: 'cloves', scalar: 2}},
    ],
    instructions: [
      {description: 'Chop chicken, onion, and garlic.'},
      {description: 'Cook onion and garlic in a pan until soft.'},
      {description: 'Add chicken and cook until browned.'},
      {
        description:
          'Add curry powder and coconut milk, and simmer for 20 minutes.',
      },
    ],
  },
  {
    id: 8,
    name: 'Beef Stew',
    nutrition: {calories: 600, fat: 25, carbs: 50, protein: 35},
    ingredients: [
      {id: 34, name: 'Beef', quantity: {unit: 'grams', scalar: 300}},
      {id: 35, name: 'Potato', quantity: {unit: 'units', scalar: 2}},
      {id: 36, name: 'Carrot', quantity: {unit: 'units', scalar: 2}},
      {id: 37, name: 'Onion', quantity: {unit: 'units', scalar: 1}},
      {id: 38, name: 'Beef Broth', quantity: {unit: 'cups', scalar: 2}},
    ],
    instructions: [
      {description: 'Chop beef, potatoes, carrots, and onion.'},
      {description: 'Brown beef in a pot.'},
      {description: 'Add vegetables and broth, and simmer for 1 hour.'},
    ],
  },
  {
    id: 9,
    name: 'Omelette',
    nutrition: {calories: 250, fat: 15, carbs: 5, protein: 20},
    ingredients: [
      {id: 39, name: 'Eggs', quantity: {unit: 'units', scalar: 3}},
      {id: 40, name: 'Cheese', quantity: {unit: 'grams', scalar: 50}},
      {id: 41, name: 'Bell Pepper', quantity: {unit: 'units', scalar: 1}},
      {id: 42, name: 'Onion', quantity: {unit: 'units', scalar: 0.5}},
      {id: 43, name: 'Butter', quantity: {unit: 'tablespoons', scalar: 1}},
    ],
    instructions: [
      {description: 'Chop bell pepper and onion.'},
      {description: 'Beat eggs in a bowl.'},
      {description: 'Heat butter in a pan.'},
      {description: 'Add vegetables to the pan and cook until soft.'},
      {description: 'Pour eggs into the pan and cook until set.'},
      {description: 'Add cheese and fold omelette in half.'},
    ],
  },
  {
    id: 10,
    name: 'Caesar Salad',
    nutrition: {calories: 350, fat: 25, carbs: 10, protein: 15},
    ingredients: [
      {id: 44, name: 'Romaine Lettuce', quantity: {unit: 'cups', scalar: 2}},
      {
        id: 45,
        name: 'Caesar Dressing',
        quantity: {unit: 'tablespoons', scalar: 3},
      },
      {id: 46, name: 'Parmesan Cheese', quantity: {unit: 'grams', scalar: 30}},
      {id: 47, name: 'Croutons', quantity: {unit: 'cups', scalar: 1}},
      {id: 48, name: 'Chicken Breast', quantity: {unit: 'grams', scalar: 150}},
    ],
    instructions: [
      {description: 'Grill chicken breast until fully cooked.'},
      {description: 'Chop romaine lettuce.'},
      {description: 'Slice grilled chicken and add to salad.'},
      {
        description:
          'Add Caesar dressing, Parmesan cheese, and croutons, and toss to combine.',
      },
    ],
  },
];
