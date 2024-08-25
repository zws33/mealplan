import {Pool} from 'pg';
import {PostgresIngredientRepository} from './ingredientsRepository';
test('insert, update, delete, find all ingredient', async () => {
  const pool = dbPool();
  const ingredientRepository = new PostgresIngredientRepository(pool);
  const newIngredient = await ingredientRepository.insertIngredient({
    name: 'apple',
  });
  expect(newIngredient.name).toBe('apple');
  const updatedIngredient = await ingredientRepository.updateIngredient(
    newIngredient.id,
    {
      name: 'orange',
    }
  );
  expect(updatedIngredient.name).toBe('orange');
  const deletedIngredient = await ingredientRepository.deleteIngredient(
    newIngredient.id
  );
  expect(deletedIngredient.name).toBe('orange');
  const allIngredients = await ingredientRepository.findAllIngredients();
  expect(allIngredients.length).not.toContainEqual(deletedIngredient);
  pool.end();
});

test('insert duplicate throws error', async () => {
  const pool = dbPool();
  const ingredientRepository = new PostgresIngredientRepository(pool);
  const result = await ingredientRepository.insertIngredient({
    name: 'apple',
  });
  try {
    await ingredientRepository.insertIngredient({
      name: 'apple',
    });
  } catch (e) {
    expect(e).toEqual(
      new Error(
        'duplicate key value violates unique constraint "ingredients_ingredient_name_key"'
      )
    );
  }
  await ingredientRepository.deleteIngredient(result.id);
  pool.end();
});

function dbPool() {
  return new Pool({
    user: 'development',
    host: 'localhost',
    database: 'recipes',
    password: 'development',
    port: 5432,
  });
}
