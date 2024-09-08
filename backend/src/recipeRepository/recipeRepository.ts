import {MealTypeSchema, Recipe, RecipeInput} from '../models/models';
import {z} from 'zod';

export interface RecipeRepository {
  createRecipe(recipeInput: RecipeInput): Promise<Recipe>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
  getRecipes(queryParams: GetRecipesQueryParams): Promise<Recipe[]>;
}

export const GetRecipesQuerySchema = z.object({
  mealType: MealTypeSchema.optional(),
  nameIncludes: z.string().optional(),
  minProtein: z.number().optional(),
  maxProtein: z.number().optional(),
  minCalories: z.number().optional(),
  maxCalories: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRecipesQueryParams = z.infer<typeof GetRecipesQuerySchema>;
