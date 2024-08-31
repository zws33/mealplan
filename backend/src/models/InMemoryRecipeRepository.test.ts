import {InMemoryRecipeRepository} from './recipeRepository';
import {RecipeSchema} from './models';
import {readFileSync} from 'node:fs';

const json = readFileSync('./src/models/TestRecipe.json', 'utf-8');

describe('InMemoryRecipeRepository', () => {
  const repository = new InMemoryRecipeRepository('./src/models/recipes.json');
  const expectedRecipe = RecipeSchema.parse(JSON.parse(json));
  test('getRecipeById returns the correct recipe', async () => {
    const actual = await repository.getRecipeById(396);
    expect(actual).toEqual(expectedRecipe);
  });
});
