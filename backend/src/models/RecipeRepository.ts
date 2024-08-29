import {Recipe, RecipeSchema} from './models';
import {promises as fs} from 'node:fs';

export interface RecipeRepository {
  getRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe>;
}

export class InMemoryRecipeRepository implements RecipeRepository {
  private recipes: Map<number, Recipe> = new Map();
  constructor(private readonly filePath: string) {}

  async getRecipeById(id: number): Promise<Recipe> {
    if (this.recipes.size === 0) {
      await this.init();
    }
    {
      return this.recipes.get(id)!;
    }
  }

  async getRecipes(): Promise<Recipe[]> {
    if (this.recipes.size === 0) {
      await this.init();
      return Array.from(this.recipes.values());
    }
    {
      return Array.from(this.recipes.values());
    }
  }
  async init() {
    const recipes = await this.readAndValidateRecipeFile(this.filePath);
    recipes.forEach(recipe => {
      this.recipes.set(recipe.id, recipe);
    });
  }

  async readAndValidateRecipeFile(filePath: string) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');

      const recipeData: Recipe[] = JSON.parse(fileContent).map(
        (recipe: unknown) => {
          return RecipeSchema.parse(recipe);
        }
      );

      return recipeData;
    } catch (error) {
      console.error('Error reading, parsing, or validating recipe file', error);
      throw error;
    }
  }
}
