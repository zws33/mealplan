import {buildMealPlans} from './buildMealPlan';
import {RecipeRepository} from './recipeRepository';
import {notEmpty, totalCombinations} from './util';

const recipeRepository = RecipeRepository.create();
const recipes = recipeRepository.getAllRecipes();
const mealPlanCount = 3;
const calorieLimit = 1700;
const mealPlans = buildMealPlans(
  recipes.map(recipe => ({id: recipe.id, calories: recipe.nutrition.calories})),
  mealPlanCount,
  calorieLimit
);

console.log(
  'total possible meal plans:',
  totalCombinations(recipes.length, mealPlanCount)
);

console.log('meal plans within calorie limit:', mealPlans.length);

console.log(
  mealPlans.map(mealPlan =>
    mealPlan
      .map(meal => {
        return recipeRepository.getRecipe(meal.id)?.name;
      })
      .filter(notEmpty)
  )
);
