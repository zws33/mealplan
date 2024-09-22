import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeTag,
} from '../models/models';

export interface Repository {
  createRecipe(recipeInput: RecipeInput): Promise<{id: number; name: string}>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
  createIngredient(ingredient: IngredientInput): Promise<Ingredient>;
  getIngredientById(id: number): Promise<Ingredient>;
}
export type RecipeRequestParams = {
  tags?: RecipeTag[] | undefined;
  nameIncludes?: string | undefined;
  minProtein?: number | undefined;
  maxProtein?: number | undefined;
  minCalories?: number | undefined;
  maxCalories?: number | undefined;
  limit?: number | undefined;
};
