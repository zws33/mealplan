import {MealPlanBuilder} from './mealPlanBuilder';
import {calculateRecipeCalories, getMacros} from '../models/models';
import {ModelGenerator} from '../models/modelGenerator';

describe('MealPlanBuilder', () => {
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
  const numberOfDays = 3;
  const dailyCalorieLimit = 10000;
  const desiredProteinPerMeal = 5;
  const recipes = new ModelGenerator().generateRecipes(100);
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
  test('mealplan contains meals grouped by type', () => {
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
