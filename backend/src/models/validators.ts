import z from 'zod';

export const IngredientSchema = z.object({
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
  quantity: z.number(),
  unit: z.string(),
});

const InstructionSchema = z.object({
  stepNumber: z.number(),
  description: z.string(),
});

const MacrosSchema = z.object({
  fat: z.number(),
  carbohydrate: z.number(),
  protein: z.number(),
});

export const RecipeTagSchema = z.enum(['breakfast', 'lunch', 'dinner']);

export const RecipeSchema = z.object({
  id: z.number(),
  tags: RecipeTagSchema.array(),
  name: z.string(),
  ingredients: z.array(QuantifiedIngredientSchema),
  instructions: z.array(InstructionSchema),
});

export const RecipeRequestSchema = z.object({
  tags: RecipeTagSchema.array().optional(),
  nameIncludes: z.string().optional(),
  minProtein: z.number().optional(),
  maxProtein: z.number().optional(),
  minCalories: z.number().optional(),
  maxCalories: z.number().optional(),
  limit: z.number().optional(),
});
