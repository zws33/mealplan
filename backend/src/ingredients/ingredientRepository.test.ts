import {Pool} from 'pg';
import {PostgresIngredientRepository} from './ingredientsRepository';
import {Nutrition} from '../models/models';
describe('PostgresIngredientRepository ingredient CRUD operations', () => {
  const testIngredient = {
    name: 'apple',
  };
  const testUnit = 'g';
  const testNutrition = {
    unit: testUnit,
    fat: 5.0,
    carbs: 20.0,
    protein: 10.0,
  };
  test('should insert, update, delete, find all ingredient', async () => {
    const pool = pgPool();
    const ingredientRepository = new PostgresIngredientRepository(pool);
    const newIngredient = await ingredientRepository.insertIngredient(
      testIngredient,
      testNutrition
    );
    expect(newIngredient.name).toBe('apple');
    const updatedIngredient = await ingredientRepository.updateIngredient(
      newIngredient.id,
      {
        name: 'orange',
      }
    );
    expect(updatedIngredient.name).toBe('orange');
    const nutrition = await ingredientRepository.getNutritionById(
      newIngredient.id
    );
    expect(nutrition[0].unit).toBe(testUnit);
    const deletedIngredient = await ingredientRepository.deleteIngredient(
      newIngredient.id
    );
    expect(deletedIngredient.name).toBe('orange');
    const allIngredients = await ingredientRepository.getAllIngredients();
    try {
      await ingredientRepository.getNutritionById(newIngredient.id);
    } catch (e) {
      expect(e).toEqual(new Error('No nutrition data found'));
    }
    expect(allIngredients).not.toContainEqual(deletedIngredient);
    pool.end();
  });
});

describe('PostgresIngredientRepository nutrition CRUD operations', () => {
  let pool: Pool;
  let repository: PostgresIngredientRepository;
  let testId: number;
  const testUnit = 'g';
  beforeEach(async () => {
    pool = pgPool();
    const insertIngredient =
      'INSERT INTO ingredients (ingredient_name) VALUES ($1) RETURNING *';
    const result = await pool.query(insertIngredient, ['apple']);

    testId = result.rows[0].ingredient_id;
    repository = new PostgresIngredientRepository(pool);
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

function pgPool() {
  return new Pool({
    user: 'development',
    host: 'localhost',
    database: 'recipes',
    password: 'development',
    port: 5432,
  });
}
