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
    const recipeResult = await client.query<{id: number; name: string}>(
      `INSERT INTO recipe (name) 
      VALUES ($1) 
      RETURNING *`,
      [recipeInput.name]
    );
    for (const quantifiedIngredient of recipeInput.ingredients) {
      await client.query(
        `INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity, unit) 
        VALUES ($1, $2, $3, $4)`,
        [
          recipeResult.rows[0].id,
          quantifiedIngredient.ingredient.id,
          quantifiedIngredient.quantity,
          quantifiedIngredient.unit,
        ]
      );
    }
    for (const instruction of recipeInput.instructions) {
      await client.query(
        `INSERT INTO recipe_instruction (recipe_id, step_number, description) 
        VALUES ($1, $2, $3)`,
        [recipeResult.rows[0].id, instruction.step, instruction.description]
      );
    }
    for (const tag of recipeInput.tags) {
      await client.query(
        `INSERT INTO recipe_tag (recipe_id, tag) 
        VALUES ($1, $2)`,
        [recipeResult.rows[0].id, tag]
      );
    }
    client.query('COMMIT');
    return {
      recipe: recipeResult.rows[0],
    };
  } catch (e) {
    client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getRecipeById(id: number) {
  const result = await PostgresDb.query<Recipe>(
    'SELECT * FROM recipe WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function insertIngredient(db: DB, ingredient: IngredientInput) {
  const result = await db.query<Ingredient>(
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
  return result.rows[0];
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

interface DB {
  query<T>(query: string, values?: any[]): Promise<{rows: T[]}>;
}
