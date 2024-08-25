import {Pool} from 'pg';
import {PostgresNutritionRepository} from './nutritionRepository';
import {Nutrition} from '../models/models';
function pgPool() {
  return new Pool({
    user: 'development',
    host: 'localhost',
    database: 'recipes',
    password: 'development',
    port: 5432,
  });
}

describe('PostgresNutritionRepository', () => {
  let pool: Pool;
  let repository: PostgresNutritionRepository;
  let testId: number;
  const testUnit = 'g';
  beforeEach(async () => {
    pool = pgPool();
    const insertIngredient =
      'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *';
    const result = await pool.query(insertIngredient, ['apple']);

    testId = result.rows[0].ingredient_id;
    repository = new PostgresNutritionRepository(pool);
  });

  afterEach(async () => {
    const deleteNutrition = `
    DELETE FROM nutrition
    WHERE ingredient_id = $1 AND unit = $2
    RETURNING * 
    `;
    await pool.query(deleteNutrition, [testId, testUnit]);

    const deleteIngredient = 'DELETE FROM ingredients WHERE ingredient_id = $1';
    await pool.query(deleteIngredient, [testId]);

    return pool.end();
  });

  it('should create nutrition', async () => {
    const ingredientId = testId;
    const nutritionData = {
      unit: testUnit,
      fat: 5.0,
      carbs: 20.0,
      protein: 10.0,
    };
    const result: Nutrition[] = await repository.createNutrition(
      ingredientId,
      nutritionData
    );
    expect(result[0].ingredient_id).toEqual(testId);
    expect(result[0].unit).toEqual(testUnit);
  });
});
