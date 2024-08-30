import {MealPlanBuilder} from './MealPlanBuilder';
import {calculateRecipeCalories, getMacros} from '../models/models';
import {Recipe, RecipeSchema} from '../models/models';
import {readFileSync} from 'node:fs';

describe('MealPlanBuilder', () => {
  const recipeFilePath = './src/models/recipes.json';
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
  const numberOfDays = 3;
  const dailyCalorieLimit = 10000;
  const desiredProteinPerMeal = 5;
  const recipes = readAndValidateRecipeFile(recipeFilePath);
  const meals = recipes.map(recipe => {
    return {
      id: recipe.id,
      calories: calculateRecipeCalories(recipe),
      protein: getMacros(recipe).protein,
      mealType: recipe.mealType,
    };
  })!;
  const builder = new MealPlanBuilder(meals, {
    numberOfDays,
    dailyCalorieLimit,
    desiredProteinPerMeal,
  });
  const mealPlan = builder.buildMealPlan();
  test('mealplan contains meals divided by type', () => {
    expect(mealPlan.size).toBe(mealTypes.length);
    expect(mealPlan.get('breakfast')).toBeDefined();
    expect(mealPlan.get('lunch')).toBeDefined();
    expect(mealPlan.get('dinner')).toBeDefined();
  });
  for (const mealType of mealTypes) {
    test(`expect ${mealType} meals meet criteria`, () => {
      const result = mealPlan.get(mealType);
      expect(result).toBeDefined();
      expect(result!.length).toBe(numberOfDays);
      expect(result!.every(meal => meal.mealType === mealType)).toBe(true);
      const totalCalories = result!.reduce(
        (sum, meal) => sum + meal.calories,
        0
      );
      expect(totalCalories < dailyCalorieLimit).toBe(true);
      const averageProtein =
        result!.reduce((sum, meal) => sum + meal.protein, 0) / result!.length;
      expect(averageProtein).toBeGreaterThanOrEqual(desiredProteinPerMeal);
    });
  }
});

function readAndValidateRecipeFile(filePath: string) {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');

    const recipeData: Recipe[] = JSON.parse(fileContent).map(
      (recipe: unknown) => {
        return RecipeSchema.parse(recipe);
      }
    );

    return recipeData;
  } catch (error) {
    console.error('Error reading, parsing, or validating recipe file', error);
    throw error;
  }
}
