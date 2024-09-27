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

export type Recipe = z.infer<typeof RecipeSchema>;
export type QuantifiedIngredient = z.infer<typeof QuantifiedIngredientSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type Instruction = z.infer<typeof InstructionSchema>;
export const RecipeTags = ['breakfast', 'lunch', 'dinner'] as const;
export type RecipeTag = (typeof RecipeTags)[number];
export type Macros = z.infer<typeof MacrosSchema>;

export type RecipeInput = Omit<Recipe, 'id'>;
export type IngredientInput = Omit<Ingredient, 'id'>;
