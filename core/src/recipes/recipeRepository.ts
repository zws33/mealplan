import {RecipesDb} from './data/database';

export async function createIngredient(ingredientData: {
  name: string;
  unit: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
}): Promise<{}> {
  const client = await RecipesDb.connect(); // Get a connection from the pool
  try {
    await client.query('BEGIN');
    const queryText =
      'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *';
    const ingredientQueryResult = await client.query(queryText, [
      ingredientData.name,
    ]);
    const ingredientId = ingredientQueryResult.rows[0].ingredient_id;
    const nutritionQuery = `
      INSERT INTO nutrition (ingredient_id, unit, calories, fat, carbs, protein) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
      `;
    const nuturitionQueryResult = await client.query(nutritionQuery, [
      ingredientId,
      ingredientData.unit,
      ingredientData.calories,
      ingredientData.fat,
      ingredientData.carbs,
      ingredientData.protein,
    ]);
    client.query('COMMIT');
    const newIngredient = {
      id: ingredientId,
      name: ingredientQueryResult.rows[0].ingredient_name,
      unit: nuturitionQueryResult.rows[0].unit,
      calories: nuturitionQueryResult.rows[0].calories,
      fat: nuturitionQueryResult.rows[0].fat,
      carbs: nuturitionQueryResult.rows[0].carbs,
      protein: nuturitionQueryResult.rows[0].protein,
    };
    return newIngredient;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
