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
  quantifiedIngredients: z.array(QuantifiedIngredientSchema),
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

export const IngredientInputSchema = IngredientSchema.omit({id:true});
export const RecipeInputSchema = z.object({
  name: z.string(),
  tags: RecipeTagSchema.array(),
  ingredients: z.object({
    quantity: z.number(),
    unit: z.string(),
    ingredientId: z.number(),
  }).array(),
  instructions: InstructionSchema.array()
})
export type RecipeInput = z.infer<typeof RecipeInputSchema>;
export type IngredientInput = z.infer<typeof IngredientInputSchema>;
export type RecipeRequestParams = {
  tags?: RecipeTag[] | undefined;
  nameIncludes?: string | undefined;
  minProtein?: number | undefined;
  maxProtein?: number | undefined;
  minCalories?: number | undefined;
  maxCalories?: number | undefined;
  limit?: number | undefined;
};
