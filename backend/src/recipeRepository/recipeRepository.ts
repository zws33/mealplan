import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeRequestParams,
} from '../models/models';

export interface RecipeRepository {
  createRecipe(recipeInput: RecipeInput): Promise<Recipe>;
  findRecipeById(id: number): Promise<Recipe | undefined>;
  findAllRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
  createIngredient(ingredient: IngredientInput): Promise<Ingredient>;
  findIngredientById(id: number): Promise<Ingredient>;
}
