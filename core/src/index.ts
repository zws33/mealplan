import {buildMealPlans} from './buildMealPlan';
import {RecipeRepository} from './recipeRepository';
import {notEmpty} from './util';

const recipeRepository = RecipeRepository.create();
const recipes = recipeRepository.getRecipes();
const mealPlans = buildMealPlans(
  recipes.map(recipe => ({id: recipe.id, calories: recipe.nutrition.calories})),
  3,
  2000
);

console.log(
  mealPlans.map(mealPlan =>
    mealPlan
      .map(meal => recipes.find(recipe => recipe.id === meal.id)?.name)
      .filter(notEmpty)
  )
);
