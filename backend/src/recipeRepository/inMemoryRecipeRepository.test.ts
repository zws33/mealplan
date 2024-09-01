import {InMemoryRecipeRepository} from './recipeRepository';
import {existsSync, unlink, writeFileSync} from 'node:fs';
import {ModelGenerator} from '../models/modelGenerator';
import {Recipe} from '../models/models';

describe('InMemoryRecipeRepository', () => {
  let expectedRecipe: Recipe;
  let repository: InMemoryRecipeRepository;
  let testDataPath: string;

  beforeEach(() => {
    testDataPath = './src/recipeRepository/testRecipes.json';
    if (existsSync(testDataPath)) {
      throw new Error('Test file already exists');
    }
    const testRecipes = new ModelGenerator().generateRecipes(10);
    const jsonString = JSON.stringify(testRecipes, null, 2);
    writeFileSync(testDataPath, jsonString, 'utf-8');
    expectedRecipe = testRecipes[0];
    repository = new InMemoryRecipeRepository(testDataPath);
  });

  test('getRecipeById returns the correct recipe', async () => {
    const actual = await repository.getRecipeById(expectedRecipe.id);
    expect(actual).toEqual(expectedRecipe);
  });

  afterAll(() => {
    writeFileSync(testDataPath, '[]', 'utf-8');
    unlink(testDataPath, (err: unknown) => {
      if (err) throw err;
    });
  });
});
