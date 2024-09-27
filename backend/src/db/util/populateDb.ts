import {readFileSync} from 'fs';
import {PostgresRepository} from '../../recipeRepository/postgresRepository';
import {db} from '../postgresDb';

async function populateDatabase() {
  const repository = new PostgresRepository(db);
  try {
    const ingredientsJson = readFileSync('./src/db/ingredients.json', 'utf-8');
    const ingredients = JSON.parse(ingredientsJson);
    const recipeData = readFileSync('./src/db/recipes.json', 'utf-8');
    const recipes = JSON.parse(recipeData);

    for (const ingredient of ingredients) {
      await repository.createIngredient(ingredient);
    }
    for (const recipe of recipes) {
      await repository.createRecipe(recipe);
    }
  } catch (e) {
    console.error(e);
  }
}
populateDatabase();
