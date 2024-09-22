import {LoremIpsum} from 'lorem-ipsum';
import {Ingredient, Instruction, QuantifiedIngredient, Recipe} from './models';

type RecipeOptions = {
  protein?: {min: number; max: number};
  carbohydrates?: {min: number; max: number};
  fat?: {min: number; max: number};
  instructions?: {min: number; max: number};
};

export class ModelGenerator {
  protein: {min: number; max: number};
  carbohydrates: {min: number; max: number};
  fat: {min: number; max: number};
  instructions: {min: number; max: number};
  constructor(recipeOptions: RecipeOptions = {}) {
    this.protein = recipeOptions.protein ?? {min: 1, max: 100};
    this.carbohydrates = recipeOptions.carbohydrates ?? {min: 1, max: 100};
    this.fat = recipeOptions.fat ?? {min: 1, max: 100};
    this.instructions = recipeOptions.instructions ?? {min: 1, max: 3};
  }

  generateIngredient(count = 1): Ingredient[] {
    const ingredients = new Set<Ingredient>();
    while (ingredients.size < count) {
      ingredients.add({
        id: randomInt(0, 10000),
        name: textGenerator.generateWords(randomInt(1, 3)),
        unit: 'g',
        servingSize: 100,
        protein: randomInt(this.protein.min, this.protein.max),
        carbohydrates: randomInt(
          this.carbohydrates.min,
          this.carbohydrates.max
        ),
        fat: randomInt(this.fat.min, this.fat.max),
      });
    }
    return [...ingredients];
  }

  generateInstructions(count = 1) {
    const instructions: Instruction[] = [];
    for (let i = 0; i < count; i++) {
      instructions.push({
        stepNumber: i,
        description: textGenerator.generateSentences(1),
      });
    }
    return instructions;
  }

  generateRecipes(count = 1): Recipe[] {
    const recipes = Array<Recipe>();
    for (let i = 0; i < count; i++) {
      const ingredients = this.generateQuantifiedIngredients(randomInt(4, 8));
      recipes.push({
        id: i,
        tags: [(['breakfast', 'lunch', 'dinner'] as const)[randomInt(0, 3)]],
        name: textGenerator.generateWords(randomInt(1, 3)),
        ingredients: ingredients,
        instructions: this.generateInstructions(
          randomInt(this.instructions.min, this.instructions.max)
        ),
      });
    }
    return recipes;
  }

  generateQuantifiedIngredients(count = 1): QuantifiedIngredient[] {
    return [...this.generateIngredient(count)].map(toQuantifiedIngredient);
  }
}

const textGenerator = new LoremIpsum({
  wordsPerSentence: {
    max: 10,
    min: 5,
  },
});

function randomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function toQuantifiedIngredient(ingredient: Ingredient): QuantifiedIngredient {
  return {
    unit: 'g',
    ingredient: ingredient,
    quantity: randomInt(1, 100),
  };
}
