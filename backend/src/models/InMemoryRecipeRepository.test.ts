import {InMemoryRecipeRepository} from './RecipeRepository';
import {RecipeSchema} from './models';
const json = `{
  "id": 396,
  "mealType": "breakfast",
  "name": "do velit",
  "ingredients": [
    {
      "unit": "g",
      "ingredient": {
        "id": 310,
        "name": "exercitation veniam",
        "unit": "g",
        "servingSize": 100,
        "protein": 95,
        "carbohydrates": 79,
        "fat": 32
      },
      "amount": 38
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 656,
        "name": "ipsum",
        "unit": "g",
        "servingSize": 100,
        "protein": 7,
        "carbohydrates": 46,
        "fat": 50
      },
      "amount": 58
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 523,
        "name": "mollit",
        "unit": "g",
        "servingSize": 100,
        "protein": 14,
        "carbohydrates": 12,
        "fat": 36
      },
      "amount": 86
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 542,
        "name": "Lorem voluptate",
        "unit": "g",
        "servingSize": 100,
        "protein": 11,
        "carbohydrates": 20,
        "fat": 53
      },
      "amount": 11
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 32,
        "name": "est enim",
        "unit": "g",
        "servingSize": 100,
        "protein": 34,
        "carbohydrates": 35,
        "fat": 12
      },
      "amount": 42
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 63,
        "name": "esse excepteur",
        "unit": "g",
        "servingSize": 100,
        "protein": 55,
        "carbohydrates": 58,
        "fat": 63
      },
      "amount": 64
    },
    {
      "unit": "g",
      "ingredient": {
        "id": 619,
        "name": "aliquip incididunt",
        "unit": "g",
        "servingSize": 100,
        "protein": 39,
        "carbohydrates": 60,
        "fat": 54
      },
      "amount": 8
    }
  ],
  "instructions": [
    {
      "description": "Commodo aliquip amet qui aliquip."
    },
    {
      "description": "Sunt sint eu excepteur ullamco."
    }
  ]
}`;
describe('InMemoryRecipeRepository', () => {
  const filePath = './src/models/recipes.json';
  const repository = new InMemoryRecipeRepository(filePath);
  const expectedRecipe = RecipeSchema.parse(JSON.parse(json));
  test('getRecipeById returns the correct recipe', async () => {
    const actual = await repository.getRecipeById(396);
    expect(actual).toEqual(expectedRecipe);
  });
});
