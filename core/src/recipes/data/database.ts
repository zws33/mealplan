import {Pool} from 'pg';

export const RecipesDb = new Pool({
  user: 'development',
  host: 'localhost',
  database: 'recipes',
  password: 'development',
  port: 5432,
});
