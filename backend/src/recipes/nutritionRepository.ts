import {PoolClient} from 'pg';
import {Nutrition} from './models/recipe';

export interface NutritionRepository {
  createNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      calories: number;
      fat: number;
      carbs: number;
      protein: number;
    }
  ): Promise<Nutrition[]>;
}

class PostgresNutritionRepository implements NutritionRepository {
  constructor(private readonly client: PoolClient) {}
  async createNutrition(
    ingredientId: number,
    nutritionData: {
      unit: string;
      calories: number;
      fat: number;
      carbs: number;
      protein: number;
    }
  ) {
    const query = `
    INSERT INTO nutrition (ingredient_id, unit, calories, fat, carbs, protein) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *
    `;
    const result = await this.client.query<Nutrition>(query, [
      ingredientId,
      nutritionData.unit,
      nutritionData.calories,
      nutritionData.fat,
      nutritionData.carbs,
      nutritionData.protein,
    ]);
    return result.rows;
  }
}
