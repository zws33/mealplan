import {RecipesDb} from './data/database';
test('create ingredient returns ingredient', async () => {
  const db = RecipesDb.connect();
  expect(db).toBeDefined();
});
