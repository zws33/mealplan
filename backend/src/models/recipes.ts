import {Recipe} from './models';

export const recipes: Recipe[] = [
  {
    id: 1,
    name: 'Spaghetti Bolognese',
    ingredients: [
      {ingredient: {id: 1, name: 'Spaghetti'}, quantity: 200, unit: 'grams'},
      {ingredient: {id: 2, name: 'Ground Beef'}, quantity: 150, unit: 'grams'},
      {ingredient: {id: 3, name: 'Tomato Sauce'}, quantity: 1, unit: 'cup'},
      {ingredient: {id: 4, name: 'Onion'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 5, name: 'Garlic'}, quantity: 2, unit: 'cloves'},
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
    ingredients: [
      {
        ingredient: {id: 6, name: 'Chicken Breast'},
        quantity: 200,
        unit: 'grams',
      },
      {ingredient: {id: 7, name: 'Lettuce'}, quantity: 2, unit: 'cups'},
      {ingredient: {id: 8, name: 'Tomato'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 9, name: 'Cucumber'}, quantity: 1, unit: 'unit'},
      {
        ingredient: {id: 10, name: 'Olive Oil'},
        quantity: 2,
        unit: 'tablespoons',
      },
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
    ingredients: [
      {ingredient: {id: 11, name: 'Ground Beef'}, quantity: 200, unit: 'grams'},
      {ingredient: {id: 12, name: 'Taco Shells'}, quantity: 4, unit: 'unit'},
      {ingredient: {id: 13, name: 'Cheese'}, quantity: 50, unit: 'grams'},
      {ingredient: {id: 14, name: 'Lettuce'}, quantity: 1, unit: 'cup'},
      {ingredient: {id: 15, name: 'Salsa'}, quantity: 0.5, unit: 'cup'},
    ],
    instructions: [
      {description: 'Brown ground beef in a pan.'},
      {description: 'Fill taco shells with beef, cheese, lettuce, and salsa.'},
    ],
  },
  {
    id: 4,
    name: 'Vegetable Stir Fry',
    ingredients: [
      {ingredient: {id: 16, name: 'Broccoli'}, quantity: 2, unit: 'cups'},
      {ingredient: {id: 17, name: 'Carrot'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 18, name: 'Bell Pepper'}, quantity: 1, unit: 'unit'},
      {
        ingredient: {id: 19, name: 'Soy Sauce'},
        quantity: 2,
        unit: 'tablespoons',
      },
      {
        ingredient: {id: 20, name: 'Olive Oil'},
        quantity: 1,
        unit: 'tablespoon',
      },
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
    ingredients: [
      {ingredient: {id: 21, name: 'Flour'}, quantity: 1, unit: 'cup'},
      {ingredient: {id: 22, name: 'Milk'}, quantity: 1, unit: 'cup'},
      {ingredient: {id: 23, name: 'Egg'}, quantity: 1, unit: 'unit'},
      {
        ingredient: {id: 24, name: 'Baking Powder'},
        quantity: 1,
        unit: 'teaspoon',
      },
      {ingredient: {id: 25, name: 'Sugar'}, quantity: 1, unit: 'tablespoon'},
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
    ingredients: [
      {ingredient: {id: 26, name: 'Bread'}, quantity: 2, unit: 'slices'},
      {ingredient: {id: 27, name: 'Cheese'}, quantity: 2, unit: 'slices'},
      {ingredient: {id: 28, name: 'Butter'}, quantity: 1, unit: 'tablespoon'},
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
    ingredients: [
      {
        ingredient: {id: 29, name: 'Chicken Breast'},
        quantity: 200,
        unit: 'grams',
      },
      {ingredient: {id: 30, name: 'Coconut Milk'}, quantity: 1, unit: 'cup'},
      {
        ingredient: {id: 31, name: 'Curry Powder'},
        quantity: 2,
        unit: 'tablespoons',
      },
      {ingredient: {id: 32, name: 'Onion'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 33, name: 'Garlic'}, quantity: 2, unit: 'cloves'},
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
    ingredients: [
      {ingredient: {id: 34, name: 'Beef'}, quantity: 300, unit: 'grams'},
      {ingredient: {id: 35, name: 'Potato'}, quantity: 2, unit: 'unit'},
      {ingredient: {id: 36, name: 'Carrot'}, quantity: 2, unit: 'unit'},
      {ingredient: {id: 37, name: 'Onion'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 38, name: 'Beef Broth'}, quantity: 2, unit: 'cups'},
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
    ingredients: [
      {ingredient: {id: 39, name: 'Eggs'}, quantity: 3, unit: 'unit'},
      {ingredient: {id: 40, name: 'Cheese'}, quantity: 50, unit: 'grams'},
      {ingredient: {id: 41, name: 'Bell Pepper'}, quantity: 1, unit: 'unit'},
      {ingredient: {id: 42, name: 'Onion'}, quantity: 0.5, unit: 'unit'},
      {ingredient: {id: 43, name: 'Butter'}, quantity: 1, unit: 'tablespoon'},
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
];
