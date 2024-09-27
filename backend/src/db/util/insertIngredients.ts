import {readFileSync} from 'fs';
import {IngredientSchema} from '../../models/models';
import {db} from '../postgresDb';

async function insertIngredients() {
  const ingredientsJson = JSON.parse(
    readFileSync('./src/db/util/ingredients.json', 'utf-8')
  );

  const parsedIngredients = IngredientSchema.array().safeParse(ingredientsJson);

  if (!parsedIngredients.success) {
    console.error(parsedIngredients.error);
    return;
  }

  await db
    .insertInto('ingredient')
    .values(parsedIngredients.data)
    .returningAll()
    .execute();
}

(async () => {
  await insertIngredients();
})();
