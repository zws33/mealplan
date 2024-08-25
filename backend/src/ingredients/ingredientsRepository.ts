import {Pool} from 'pg';
import {Ingredient} from '../models/models';

export interface IngredientRepository {
  insertIngredient(ingredientData: {name: string}): Promise<Ingredient>;
  findAllIngredients(): Promise<Ingredient[]>;
  findIngredientById(ingredientId: number): Promise<Ingredient>;
  updateIngredient(
    id: number,
    ingredientData: {name: string}
  ): Promise<Ingredient>;
  deleteIngredient(id: number): Promise<Ingredient>;
}

export class PostgresIngredientRepository implements IngredientRepository {
  constructor(private readonly pool: Pool) {}
  async insertIngredient(ingredientData: {name: string}): Promise<Ingredient> {
    const queryText =
      'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *';
    const result = await this.pool.query(queryText, [ingredientData.name]);
    return {
      id: result.rows[0].ingredient_id,
      name: result.rows[0].ingredient_name,
    };
  }

  async findAllIngredients(): Promise<Ingredient[]> {
    const queryText = `
        SELECT ingredients.ingredient_id, ingredients.ingredient_name FROM ingredients
      `;
    const result = await this.pool.query(queryText);
    return result.rows.map(row => ({
      id: row.ingredient_id,
      name: row.ingredient_name,
    }));
  }

  async findIngredientById(ingredientId: number): Promise<Ingredient> {
    const queryText = `
        SELECT ingredients.ingredient_name FROM ingredients
        WHERE ingredients.ingredient_id = $1
      `;
    const result = await this.pool.query(queryText, [ingredientId]);
    if (result.rows.length === 0) {
      throw new Error('Ingredient not found');
    }
    return {
      id: result.rows[0].ingredient_id,
      name: result.rows[0].ingredient_name,
    };
  }

  async updateIngredient(
    id: number,
    ingredientData: {
      name: string;
    }
  ): Promise<Ingredient> {
    const updateIngredientQuery = `
        UPDATE ingredients
        SET ingredient_name = $1
        WHERE ingredient_id = $2
        RETURNING *
      `;
    const result = await this.pool.query(updateIngredientQuery, [
      ingredientData.name,
      id,
    ]);
    const updatedIngredient = {
      id: result.rows[0].ingredient_id,
      name: result.rows[0].ingredient_name,
    };
    return updatedIngredient;
  }

  async deleteIngredient(id: number): Promise<Ingredient> {
    const deleteIngredientQuery = `
        DELETE FROM ingredients
        WHERE ingredient_id = $1
        RETURNING *
      `;
    const result = await this.pool.query(deleteIngredientQuery, [id]);
    if (result.rows.length === 0) {
      throw new Error('Ingredient not found');
    } else {
      return result.rows.map(row => ({
        id: row.ingredient_id,
        name: row.ingredient_name,
      }))[0];
    }
  }
}
