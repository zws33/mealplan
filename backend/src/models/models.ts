import {z} from 'zod';

// Ingredient Schema
const IngredientSchema = z.object({
  id: z.number(),
  name: z.string(),
});

// QuantifiedIngredient Schema
const QuantifiedIngredientSchema = z.object({
  ingredient: IngredientSchema,
  amount: z.number(),
  unit: z.string(),
});

// Instruction Schema
const InstructionSchema = z.object({
  description: z.string(),
});

// Macros Schema
const MacrosSchema = z.object({
  fat: z.number(),
  carbohydrate: z.number(),
  protein: z.number(),
});

// Recipe Schema
export const RecipeSchema = z.object({
  id: z.number(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  name: z.string(),
  ingredients: z.array(QuantifiedIngredientSchema),
  instructions: z.array(InstructionSchema),
  macros: MacrosSchema,
});

// Infer the TypeScript type from the zod schema
export type Recipe = z.infer<typeof RecipeSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type QuantifiedIngredient = z.infer<typeof QuantifiedIngredientSchema>;
export type Instruction = z.infer<typeof InstructionSchema>;
export type Macros = z.infer<typeof MacrosSchema>;

export function calculateCalories(macros: Macros): number {
  return macros.fat * 9 + macros.carbohydrate * 4 + macros.protein * 4;
}

export function getShoppingList(recipe: Recipe): QuantifiedIngredient[] {
  return recipe.ingredients;
}
