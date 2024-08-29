import {buildMealPlan} from '../mealplan/buildMealPlan';
import {calculateCalories} from './models';
import {InMemoryRecipeRepository, RecipeRepository} from './RecipeRepository';

const recipeFilePath = './src/models/recipes.json';
(async () => {
  const repository = new InMemoryRecipeRepository(recipeFilePath);
  await main(repository);
})();
async function main(repository: RecipeRepository) {
  const recipes = await repository.getRecipes();

  if (recipes) {
    const meals = recipes.map(recipe => {
      return {
        id: recipe.id,
        calories: calculateCalories(recipe.macros),
        protein: recipe.macros.protein,
      };
    });
    if (!meals) {
      throw new Error('No meals found');
    }

    const mealPlan = buildMealPlan(meals, 3, 1700, 80);
    console.log(mealPlan);
  }
}
