import {
  Ingredient,
  IngredientInput,
  MealTagSchema,
  Recipe,
  RecipeInput,
} from '../models/models';
import {z} from 'zod';

export interface Repository {
  createRecipe(
    recipeInput: RecipeInput
  ): Promise<{recipe: {id: number; name: string}}>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
  getRecipes(queryParams: GetRecipesQueryParams): Promise<Recipe[]>;
  insertIngredient(ingredient: IngredientInput): Promise<Ingredient>;
  getIngredientById(id: number): Promise<Ingredient>;
}

export const GetRecipesQuerySchema = z.object({
  tags: MealTagSchema.array().optional(),
  nameIncludes: z.string().optional(),
  minProtein: z.number().optional(),
  maxProtein: z.number().optional(),
  minCalories: z.number().optional(),
  maxCalories: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRecipesQueryParams = z.infer<typeof GetRecipesQuerySchema>;
