import {z} from 'zod';

const IngredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  unit: z.string(),
  servingSize: z.number(),
  protein: z.number(),
  carbohydrates: z.number(),
  fat: z.number(),
});

const QuantifiedIngredientSchema = z.object({
  ingredient: IngredientSchema,
  amount: z.number(),
  unit: z.string(),
});

const InstructionSchema = z.object({
  description: z.string(),
});

const MacrosSchema = z.object({
  fat: z.number(),
  carbohydrate: z.number(),
  protein: z.number(),
});

const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner']);

export const RecipeSchema = z.object({
  id: z.number(),
  mealType: MealTypeSchema,
  name: z.string(),
  ingredients: z.array(QuantifiedIngredientSchema),
  instructions: z.array(InstructionSchema),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type QuantifiedIngredient = z.infer<typeof QuantifiedIngredientSchema>;
export type Instruction = z.infer<typeof InstructionSchema>;
export type Macros = z.infer<typeof MacrosSchema>;
export type MealType = z.infer<typeof MealTypeSchema>;

export type RecipeInput = Omit<Recipe, 'id'>;

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
  const {ingredient, amount} = quantifiedIngredient;
  const multiplier = amount / ingredient.servingSize;
  return {
    fat: ingredient.fat * multiplier,
    carbohydrate: ingredient.carbohydrates * multiplier,
    protein: ingredient.protein * multiplier,
  };
}
