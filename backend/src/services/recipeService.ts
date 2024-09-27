import {Recipe, RecipeInput, RecipeRequestParams} from '../models/models';
import {RecipeRepository} from '../recipeRepository/recipeRepository';

class RecipeService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async findAllRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]> {
    return this.recipeRepository.findAllRecipes(queryParams);
  }

  async findById(id: number): Promise<Recipe | undefined> {
    return this.recipeRepository.findRecipeById(id);
  }

  async createRecipe(recipe: RecipeInput): Promise<Recipe> {
    return this.recipeRepository.createRecipe(recipe);
  }

  async update(recipe: Recipe) {
    return this.recipeRepository.updateRecipe(recipe);
  }

  async delete(id: number) {
    return this.recipeRepository.deleteRecipe(id);
  }
}
