import {PostgresDb} from '../db/postgresDb';

export async function getRecipes(): Promise<{}> {
  const client = await PostgresDb.connect();
  try {
    const queryText = `
      SELECT * FROM recipes
    `;
    const result = await client.query(queryText);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createRecipe(recipeData: {
  name: string;
  ingredients: {id: number; quantity: number; unit: string}[];
  instructions: {description: string}[];
}): Promise<{}> {
  const client = await PostgresDb.connect();
  try {
    await client.query('BEGIN');
    const recipeQueryText = `
      INSERT INTO recipes (recipe_name)
      VALUES ($1)
      RETURNING recipe_id
    `;
    const recipeQueryResult = await client.query(recipeQueryText, [
      recipeData.name,
    ]);
    recipeData.ingredients.forEach(async quantifiedIngredient => {
      console.log(quantifiedIngredient);
      const recipeIngredientQueryText = `
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES ($1, $2, $3, $4) RETURNING *
      `;
      await client.query(recipeIngredientQueryText, [
        recipeQueryResult.rows[0].recipe_id,
        quantifiedIngredient.id,
        quantifiedIngredient.quantity,
        quantifiedIngredient.unit,
      ]);
    });
    recipeData.instructions.forEach(async (instruction, index) => {
      console.log(instruction);
      const recipeInstructionQueryText = `
        INSERT INTO recipe_instructions (recipe_id, step_number, description)
        VALUES ($1, $2, $3)
      `;
      await client.query(recipeInstructionQueryText, [
        recipeQueryResult.rows[0].recipe_id,
        index + 1,
        instruction.description,
      ]);
    });
    await client.query('COMMIT');
    return {
      id: recipeQueryResult.rows[0].recipe_id,
      name: recipeQueryResult.rows[0].recipe_name,
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
