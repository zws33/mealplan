import {Macros, QuantifiedIngredient, Recipe} from './models';

export function calculateRecipeCalories(recipe: Recipe): number {
  const macros = getMacros(recipe);
  return macros.fat * 9 + macros.carbohydrate * 4 + macros.protein * 4;
}

export function getShoppingList(recipe: Recipe): QuantifiedIngredient[] {
  return recipe.ingredients;
}

export function getMacros(recipe: Recipe): Macros {
  const macros = recipe.ingredients.map(getMacrosForIngredient);
  return macros.reduce((sum, current) => {
    return {
      fat: sum.fat + current.fat,
      carbohydrate: sum.carbohydrate + current.carbohydrate,
      protein: sum.protein + current.protein,
    };
  });
}

function getMacrosForIngredient(
  quantifiedIngredient: QuantifiedIngredient
): Macros {
  const {ingredient, quantity} = quantifiedIngredient;
  const multiplier = quantity / ingredient.servingSize;
  return {
    fat: ingredient.fat * multiplier,
    carbohydrate: ingredient.carbohydrates * multiplier,
    protein: ingredient.protein * multiplier,
  };
}
