import {Pool} from 'pg';
import {CamelCasePlugin, Kysely, PostgresDialect} from 'kysely';
import {DB} from './kysely-types';
import {types} from 'pg';
types.setTypeParser(1700, parseFloat);

export const PostgresDb = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

export async function initializeDatabase() {
  await PostgresDb.connect();
  const test = await PostgresDb.query('SELECT NOW()');
  console.log(`Db connection: ${test.rows.length > 0 ? 'success' : 'failure'}`);
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: PostgresDb,
  }),
  plugins: [new CamelCasePlugin()],
});
