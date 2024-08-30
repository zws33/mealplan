import {readFileSync} from 'node:fs';
import {Recipe, RecipeSchema} from './models';

export interface RecipeRepository {
  getRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe>;
}

export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<number, Recipe> = new Map();
  constructor(private readonly filePath: string) {
    this.readAndValidateRecipeFile(filePath);
  }

  async getRecipeById(id: number): Promise<Recipe> {
    return this.recipes.get(id)!;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
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
