import { Pool } from 'pg';

const pool = new Pool({
  user: Bun.env.POSTGRES_USER,
  database: Bun.env.POSTGRES_DB,
  host: 'localhost',
  password: Bun.env.POSTGRES_PASSWORD,
  port: 5432,
});

export async function getClient() {
  const now = await pool.query('SELECT NOW()');
  if (now.rows) {
    return pool;
  } else {
    throw new Error('DB connection failed');
  }
}
