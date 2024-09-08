import {GetRecipesQueryParams} from './recipeRepository';
import {InMemoryRecipeRepository} from './inMemoryRecipeRepository';
import {unlink, writeFileSync} from 'node:fs';
import {ModelGenerator} from '../models/modelGenerator';
import {
  calculateRecipeCalories,
  getMacros,
  Recipe,
  RecipeInput,
} from '../models/models';

describe('InMemoryRecipeRepository', () => {
  let repository: InMemoryRecipeRepository;
  let testDataPath: string;
  let testRecipes: Recipe[];
  beforeEach(() => {
    testDataPath = './src/recipeRepository/testRecipes.json';
    testRecipes = new ModelGenerator().generateRecipes(100);
    const jsonString = JSON.stringify(testRecipes, null, 2);
    writeFileSync(testDataPath, jsonString, 'utf-8');
    repository = new InMemoryRecipeRepository(testDataPath);
  });

  test('getRecipeById returns the correct recipe', async () => {
    const actual = await repository.getRecipeById(testRecipes[0].id);
    expect(actual).toEqual(testRecipes[0]);
  });

  test('getRecipes returns the correct recipes', async () => {
    const queryOptions: GetRecipesQueryParams = {
      mealType: 'lunch',
      minProtein: 20,
      maxProtein: 30,
      minCalories: 200,
      maxCalories: 500,
      limit: 10,
    };
    const actual = await repository.getRecipes(queryOptions);
    expect(actual.length).toBeLessThan(queryOptions.limit!);
    actual.forEach(recipe => {
      expect(recipe.mealType).toBe('lunch');
      const macros = getMacros(recipe);
      expect(macros.protein).toBeGreaterThanOrEqual(queryOptions.minProtein!);
      expect(macros.protein).toBeLessThanOrEqual(queryOptions.maxProtein!);
      const calories = calculateRecipeCalories(recipe);
      expect(calories).toBeGreaterThanOrEqual(queryOptions.minCalories!);
      expect(calories).toBeLessThanOrEqual(queryOptions.maxCalories!);
    });
  });

  test('createRecipe should add a new recipe to the repository', async () => {
    const modelGenerator = new ModelGenerator();
    const recipeInput: RecipeInput = {
      name: 'New Recipe',
      mealType: 'lunch',
      ingredients: modelGenerator.generateQuantifiedIngredients(3),
      instructions: modelGenerator.generateInstructions(2),
    };

    const createdRecipe = await repository.createRecipe(recipeInput);

    expect(createdRecipe.id).toBeDefined();
    expect(createdRecipe.name).toBe(recipeInput.name);
    expect(createdRecipe.ingredients).toEqual(recipeInput.ingredients);
    expect(createdRecipe.instructions).toBe(recipeInput.instructions);
  });

  test('createRecipe should throw an error if a recipe with the same name already exists', async () => {
    const modelGenerator = new ModelGenerator();
    const existingRecipe: RecipeInput = {
      name: 'New Recipe',
      mealType: 'lunch',
      ingredients: modelGenerator.generateQuantifiedIngredients(3),
      instructions: modelGenerator.generateInstructions(2),
    };
    repository.createRecipe(existingRecipe);

    await expect(repository.createRecipe(existingRecipe)).rejects.toThrow(
      'Recipe with this name already exists'
    );
  });

  test('updateRecipe should update the recipe in the repository', async () => {
    const recipeToUpdate = testRecipes[0];
    const updatedRecipe = {...recipeToUpdate, name: 'Updated Name'};
    await repository.updateRecipe(updatedRecipe);
    const actual = await repository.getRecipeById(recipeToUpdate.id);
    expect(actual).toEqual(updatedRecipe);
  });

  test('deleteRecipe should remove the recipe from the repository', async () => {
    const recipeToDelete = testRecipes[0];
    const result = await repository.deleteRecipe(recipeToDelete.id);
    expect(result).toBe(true);
    expect(await repository.getRecipeById(recipeToDelete.id)).toBeUndefined();
  });

  afterAll(() => {
    writeFileSync(testDataPath, '[]', 'utf-8');
    unlink(testDataPath, (err: unknown) => {
      if (err) throw err;
    });
  });
});
