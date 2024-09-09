import {PostgresDb} from '../db/postgresDb';
import {Ingredient, IngredientInput} from '../models/models';

export async function createIngredient(ingredient: IngredientInput) {
  const result = await PostgresDb.query<Ingredient>(
    `INSERT INTO ingredient (name, fat, carbohydrates, protein) 
    VALUES ($1, $2, $3, $4) 
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
