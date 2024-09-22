export type Recipe = {
  id: number;
  name: string;
  tags: RecipeTag[];
  ingredients: QuantifiedIngredient[];
  instructions: Instruction[];
};
export type QuantifiedIngredient = {
  unit: string;
  ingredient: Ingredient;
  quantity: number;
};
export type Ingredient = {
  id: number;
  name: string;
  unit: string;
  servingSize: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};
export type Instruction = {
  stepNumber: number;
  description: string;
};
export const RecipeTags = ['breakfast', 'lunch', 'dinner'] as const;
export type RecipeTag = (typeof RecipeTags)[number];
export type Macros = {
  protein: number;
  fat: number;
  carbohydrate: number;
};

export type RecipeInput = Omit<Recipe, 'id'>;
export type IngredientInput = Omit<Ingredient, 'id'>;

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
