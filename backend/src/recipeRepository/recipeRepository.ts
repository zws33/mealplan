import {readFileSync} from 'node:fs';
import {MealType, Recipe, RecipeInput, RecipeSchema} from '../models/models';

export interface RecipeRepository {
  createRecipe(recipe: RecipeInput): Promise<Recipe>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  updateRecipe(recipe: Recipe): Promise<Recipe>;
  deleteRecipe(id: number): Promise<boolean>;
}

export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<number, Recipe> = new Map();
  constructor(private readonly filePath: string) {
    this.readAndValidateRecipeFile(filePath);
  }

  async createRecipe(recipeInput: RecipeInput): Promise<Recipe> {
    if (
      [...this.recipes.values()]
        .map(recipe => recipe.name)
        .includes(recipeInput.name)
    ) {
      throw new Error('Recipe with this name already exists');
    }
    const id: number = this.recipes.size + 1;
    const newRecipe = {
      id,
      ...recipeInput,
    };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const result = this.recipes.get(id);
    return result;
  }

  async getRecipeByMealType(mealType: MealType): Promise<Recipe[]> {
    const result = [...this.recipes.values()].filter(
      recipe => recipe.mealType === mealType
    );
    return result;
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    this.recipes.set(recipe.id, recipe);
    return recipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = this.recipes.delete(id);
    return result;
  }

  private readAndValidateRecipeFile(filePath: string) {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');

      const recipeData: Recipe[] = JSON.parse(fileContent).map(
        (recipe: unknown) => {
          return RecipeSchema.parse(recipe);
        }
      );
      recipeData.forEach(recipe => {
        this.recipes.set(recipe.id, recipe);
      });

      return recipeData;
    } catch (error) {
      console.error('Error reading, parsing, or validating recipe file', error);
      throw error;
    }
  }
}
