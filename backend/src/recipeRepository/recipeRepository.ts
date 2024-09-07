import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {
  calculateRecipeCalories,
  getMacros,
  MealTypeSchema,
  Recipe,
  RecipeInput,
  RecipeSchema,
} from '../models/models';
import {ModelGenerator} from '../models/modelGenerator';
import {z} from 'zod';

export interface RecipeRepository {
  createRecipe(recipe: RecipeInput): Promise<Recipe>;
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

export class InMemoryRecipeRepository implements RecipeRepository {
  private readonly recipes: Map<number, Recipe> = new Map();
  private readonly defultLimit = 10;

  constructor(filePathInput: string | undefined) {
    const filePath = filePathInput || './src/recipeRepository/dev_recipes.json';
    if (!existsSync(filePath)) {
      this.initializeTestData(filePath);
    }
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

  async getRecipes(queryParams: GetRecipesQueryParams): Promise<Recipe[]> {
    const recipes = [...this.recipes.values()];
    const matchesQueryParams = this.getRecipesFilter(queryParams);
    return recipes
      .filter(matchesQueryParams)
      .slice(0, queryParams.limit || this.defultLimit);
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

  private initializeTestData(filePath: string) {
    const recipes = new ModelGenerator().generateRecipes(100);
    const jsonString = JSON.stringify(recipes, null, 2);
    writeFileSync(filePath, jsonString, 'utf-8');
    return filePath;
  }

  private getRecipesFilter(
    queryParams: GetRecipesQueryParams
  ): (recipe: Recipe) => boolean {
    return (recipe: Recipe) => {
      if (queryParams.mealType && recipe.mealType !== queryParams.mealType) {
        return false;
      }
      if (
        queryParams.nameIncludes &&
        !recipe.name
          .toLowerCase()
          .includes(queryParams.nameIncludes.toLowerCase())
      ) {
        return false;
      }
      if (
        queryParams.minProtein &&
        getMacros(recipe).protein < queryParams.minProtein
      ) {
        return false;
      }
      if (
        queryParams.maxProtein &&
        getMacros(recipe).protein > queryParams.maxProtein
      ) {
        return false;
      }
      if (
        queryParams.minCalories &&
        calculateRecipeCalories(recipe) < queryParams.minCalories
      ) {
        return false;
      }
      if (
        queryParams.maxCalories &&
        calculateRecipeCalories(recipe) > queryParams.maxCalories
      ) {
        return false;
      }
      return true;
    };
  }
}
