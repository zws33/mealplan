import {MealPlanBuilder} from './MealPlanBuilder';
import {calculateCalories} from '../models/models';
import {Recipe, RecipeSchema} from '../models/models';
import {promises as fs} from 'node:fs';

const recipeFilePath = './src/models/recipes.json';
const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
type MealType = (typeof mealTypes)[number];
describe('MealPlanBuilder', () => {
  let meals: {
    id: number;
    calories: number;
    protein: number;
    mealType: MealType;
  }[];
  beforeAll(async () => {
    const recipes = await readAndValidateRecipeFile(recipeFilePath);
    meals = recipes.map(recipe => {
      return {
        id: recipe.id,
        calories: calculateCalories(recipe.macros),
        protein: recipe.macros.protein,
        mealType: recipe.mealType,
      };
    })!;
  });
  test('buildMealPlan', () => {
    const numberOfDays = 3;
    const dailyCalorieLimit = 2000;
    const desiredProteinPerMeal = 15;
    const builder = new MealPlanBuilder(meals, {
      numberOfDays,
      dailyCalorieLimit,
      desiredProteinPerMeal,
    });
    const mealPlan = builder.buildMealPlan();
    for (const mealType of mealTypes) {
      const result = mealPlan.get(mealType);
      expect(result).toBeDefined();
      expect(result!.length).toBe(numberOfDays);
      expect(result!.every(meal => meal.mealType === mealType)).toBe(true);
      expect(result!.every(meal => meal.calories <= dailyCalorieLimit)).toBe(
        true
      );
      const averageProtein =
        result!.reduce((sum, meal) => meal.protein + sum, 0) / result!.length;
      expect(averageProtein).toBeGreaterThanOrEqual(desiredProteinPerMeal);
    }
  });
});

async function readAndValidateRecipeFile(filePath: string) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

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
