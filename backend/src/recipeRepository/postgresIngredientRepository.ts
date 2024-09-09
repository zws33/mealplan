import {Client, PoolClient} from 'pg';
import {PostgresDb} from '../db/postgresDb';
import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
} from '../models/models';

export async function createRecipe(recipeInput: RecipeInput) {
  const client = await PostgresDb.connect();
  try {
    await client.query('BEGIN');
    const recipeResult = await client.query(
      `INSERT INTO recipe (name) 
      VALUES ($1) 
      RETURNING *`,
      [recipeInput.name]
    );
    const ingredientIds: number[] = [];
    for (const quantifiedIngredient of recipeInput.ingredients) {
      const ingredientId = await insertIngredient(
        client,
        quantifiedIngredient.ingredient
      );
      ingredientIds.push(ingredientId);
    }
    console.log(ingredientIds);
    client.query('COMMIT');
    return {
      recipe: recipeResult.rows[0],
      ingredients: ingredientIds,
    };
  } catch (e) {
    client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function insertIngredient(
  client: PoolClient,
  ingredient: IngredientInput
): Promise<number> {
  const insertIngredientQuery = `
  WITH existing_ingredient AS (
    -- Check if the ingredient exists
    SELECT id FROM ingredient WHERE name = $1
  ),
  inserted_ingredient AS (
    -- If not, insert it and return the new ID
    INSERT INTO ingredient (name, fat, carbohydrates, protein, serving_size, unit)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (name) DO NOTHING
    RETURNING id
  )
  SELECT id FROM existing_ingredient
  UNION ALL
  SELECT id FROM inserted_ingredient;`;
  const result = await client.query(insertIngredientQuery, [
    ingredient.name,
    ingredient.fat,
    ingredient.carbohydrates,
    ingredient.protein,
    ingredient.serving_size,
    ingredient.unit,
  ]);
  console.log(result.rows);
  return result.rows.map(row => row.id)[0];
}

export async function getRecipeById(id: number) {
  const result = await PostgresDb.query<Recipe>(
    'SELECT * FROM recipe WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function createIngredient(ingredient: IngredientInput) {
  const result = await PostgresDb.query<Ingredient>(
    `INSERT INTO ingredient (name, fat, carbohydrates, protein, serving_size, unit) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`,
    [
      ingredient.name,
      ingredient.fat,
      ingredient.carbohydrates,
      ingredient.protein,
      ingredient.serving_size,
      ingredient.unit,
    ]
  );
  return result;
}

export async function getIngredientById(id: number) {
  const result = await PostgresDb.query<Ingredient>(
    'SELECT * FROM ingredient WHERE id = $1',
    [id]
  );
  result.rows.map(ingredient => {
    return {
      name: ingredient.name,
      fat: ingredient.fat,
      carbohydrates: ingredient.carbohydrates,
      protein: ingredient.protein,
      serving_size: ingredient.serving_size,
      unit: ingredient.unit,
    };
  });
  return result.rows[0];
}
