import {LoremIpsum} from 'lorem-ipsum';
import {Ingredient, Instruction, QuantifiedIngredient, Recipe} from './models';

export const ModelGenerator = {
  generateIngredient(count = 1) {
    const ingredients: Ingredient[] = [];
    for (let i = 0; i < count; i++) {
      ingredients.push({
        id: randomInt(0, 1000),
        name: textGenerator.generateWords(randomInt(1, 3)),
        unit: 'g',
        servingSize: 100,
        protein: randomInt(1, 100),
        carbohydrates: randomInt(1, 100),
        fat: randomInt(1, 100),
      });
    }
    return ingredients;
  },
  generateInstructions(count = 1) {
    const instructions: Instruction[] = [];
    for (let i = 0; i < count; i++) {
      instructions.push({
        description: textGenerator.generateSentences(1),
      });
    }
    return instructions;
  },
  generateRecipes(count = 1): Recipe[] {
    const recipes: Recipe[] = [];
    for (let i = 0; i < count; i++) {
      const ingredients = this.generateIngredient(randomInt(4, 8)).map(
        toQuantifiedIngredient
      );
      recipes.push({
        id: randomInt(0, 1000),
        mealType: (['breakfast', 'lunch', 'dinner'] as const)[randomInt(0, 3)],
        name: textGenerator.generateWords(randomInt(1, 3)),
        ingredients: ingredients,
        instructions: this.generateInstructions(randomInt(1, 3)),
      });
    }
    return recipes;
  },
};

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
    amount: randomInt(1, 100),
  };
}
