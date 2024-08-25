import {Pool} from 'pg';
import {Nutrition} from '../models/models';

export interface NutritionRepository {
  createNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      fat: number;
      carbs: number;
      protein: number;
    }
  ): Promise<Nutrition[]>;
  deleteNutrition(ingredientId: number, unit: string): Promise<Nutrition[]>;
  updateNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      fat: number;
      carbs: number;
      protein: number;
    }
  ): Promise<Nutrition[]>;
  getNutrition(ingredientId: number): Promise<Nutrition[]>;
}

export class PostgresNutritionRepository implements NutritionRepository {
  constructor(private readonly pool: Pool) {}
  async getNutrition(ingredientId: number) {
    const query = `
    SELECT * FROM nutrition
    WHERE ingredient_id = $1
    `;
    const result = await this.pool.query<Nutrition>(query, [ingredientId]);
    return result.rows;
  }

  async createNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      fat: number;
      carbs: number;
      protein: number;
    }
  ) {
    const query = `
    INSERT INTO nutrition (ingredient_id, unit, fat, carbs, protein) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *
    `;
    const result = await this.pool.query<Nutrition>(query, [
      ingredientId,
      nutritionData.unit,
      nutritionData.fat,
      nutritionData.carbs,
      nutritionData.protein,
    ]);
    return result.rows;
  }

  async deleteNutrition(ingredientId: number, unit: string) {
    const query = `
    DELETE FROM nutrition
    WHERE ingredient_id = $1 AND unit = $2
    RETURNING * 
    `;
    const result = await this.pool.query<Nutrition>(query, [
      ingredientId,
      unit,
    ]);
    return result.rows;
  }

  async updateNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      fat: number;
      carbs: number;
      protein: number;
    }
  ) {
    const query = `
    UPDATE nutrition
    SET unit = $2, fat = $3, carbs = $4, protein = $5
    WHERE ingredient_id = $1
    RETURNING *
    `;
    const result = await this.pool.query<Nutrition>(query, [
      ingredientId,
      nutritionData.unit,
      nutritionData.fat,
      nutritionData.carbs,
      nutritionData.protein,
    ]);
    return result.rows;
  }
}
