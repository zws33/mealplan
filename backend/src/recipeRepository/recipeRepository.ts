import {
  Ingredient,
  IngredientInput,
  Instruction,
  Recipe,
  RecipeRequestParams,
  RecipeTag,
} from '../models/models';

export interface RecipeRepository {
  createRecipe(
    name: string,
    quantifiedIngredients: {
      ingredientId: number;
      quantity: number;
      unit: string;
    }[],
    instructions: Instruction[],
    tags: RecipeTag[]
  ): Promise<{id: number}>;

  findRecipeById(id: number): Promise<Recipe | undefined>;

  findAllRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]>;

  updateRecipe(recipe: Recipe): Promise<{id: number}>;

  deleteRecipe(id: number): Promise<boolean>;

  createIngredient(ingredient: IngredientInput): Promise<{id: number}>;

  findIngredientById(id: number): Promise<Ingredient | undefined>;
}
