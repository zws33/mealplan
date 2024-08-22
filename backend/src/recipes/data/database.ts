import {Pool} from 'pg';

export const RecipesDb = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
