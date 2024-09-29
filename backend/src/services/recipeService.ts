import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeRequestParams,
} from '../models/models';
import {repository} from '../recipeRepository/postgresRepository';
import {RecipeRepository} from '../recipeRepository/recipeRepository';

export class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async findAllRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]> {
    return this.recipeRepository.findAllRecipes(queryParams);
  }

  async findRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipeRepository.findRecipeById(id);
  }

  async createRecipe(recipe: RecipeInput): Promise<Recipe> {
    const result = await this.recipeRepository.createRecipe(
      recipe.name,
      recipe.ingredients,
      recipe.instructions,
      recipe.tags
    );
    const insertedRecipe = await this.findRecipeById(result.id);
    if (!insertedRecipe) {
      throw Error("Couldn't insert recipe");
    } else {
      return insertedRecipe;
    }
  }

  async update(recipe: Recipe) {
    return this.recipeRepository.updateRecipe(recipe);
  }

  async delete(id: number) {
    return this.recipeRepository.deleteRecipe(id);
  }

  async createIngredient(ingredient: IngredientInput): Promise<Ingredient> {
    const result = await this.recipeRepository.createIngredient(ingredient);
    const insertedIngredient = await this.findIngredientById(result.id);
    if (!insertedIngredient) {
      throw Error("Couldn't insert ingredient");
    } else {
      return insertedIngredient;
    }
  }

  async findIngredientById(id: number) {
    return this.recipeRepository.findIngredientById(id);
  }
}

export const recipeService = new RecipeService(repository);
