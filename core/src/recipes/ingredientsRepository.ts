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

export async function getIngredients(): Promise<{}> {
  const client = await RecipesDb.connect();
  try {
    const queryText = `
      SELECT ingredients.ingredient_id, ingredients.ingredient_name, nutrition.unit, nutrition.calories, nutrition.fat, nutrition.carbs, nutrition.protein
      FROM ingredients
      JOIN nutrition ON ingredients.ingredient_id = nutrition.ingredient_id
    `;
    const result = await client.query(queryText);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getIngredientById(id: number): Promise<{}> {
  const client = await RecipesDb.connect();
  try {
    const queryText = `
      SELECT ingredients.ingredient_id, ingredients.ingredient_name, nutrition.unit, nutrition.calories, nutrition.fat, nutrition.carbs, nutrition.protein
      FROM ingredients
      JOIN nutrition ON ingredients.ingredient_id = nutrition.ingredient_id
      WHERE ingredients.ingredient_id = $1
    `;
    const result = await client.query(queryText, [id]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateIngredient(
  id: number,
  ingredientData: {
    name: string;
    unit: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  }
): Promise<{}> {
  const client = await RecipesDb.connect();
  try {
    await client.query('BEGIN');
    const updateIngredientQuery = `
      UPDATE ingredients
      SET ingredient_name = $1
      WHERE ingredient_id = $2
      RETURNING *
    `;
    const updatedIngredientResult = await client.query(updateIngredientQuery, [
      ingredientData.name,
      id,
    ]);
    const updateNutritionQuery = `
      UPDATE nutrition
      SET unit = $1, calories = $2, fat = $3, carbs = $4, protein = $5
      WHERE ingredient_id = $6
      RETURNING *
    `;
    const updatedNutritionResult = await client.query(updateNutritionQuery, [
      ingredientData.unit,
      ingredientData.calories,
      ingredientData.fat,
      ingredientData.carbs,
      ingredientData.protein,
      id,
    ]);
    client.query('COMMIT');
    const updatedIngredient = {
      id: updatedIngredientResult.rows[0].ingredient_id,
      name: updatedIngredientResult.rows[0].ingredient_name,
      unit: updatedNutritionResult.rows[0].unit,
      calories: updatedNutritionResult.rows[0].calories,
      fat: updatedNutritionResult.rows[0].fat,
      carbs: updatedNutritionResult.rows[0].carbs,
      protein: updatedNutritionResult.rows[0].protein,
    };
    return updatedIngredient;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function deleteIngredient(id: number): Promise<void> {
  const client = await RecipesDb.connect();
  try {
    await client.query('BEGIN');
    const deleteNutritionQuery = `
      DELETE FROM nutrition
      WHERE ingredient_id = $1
    `;
    await client.query(deleteNutritionQuery, [id]);
    const deleteIngredientQuery = `
      DELETE FROM ingredients
      WHERE ingredient_id = $1
    `;
    await client.query(deleteIngredientQuery, [id]);
    client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
