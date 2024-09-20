import {Application} from 'express';
import {recipesRouter} from './routes/recipesRouter';
import {ingredientsRouter} from './routes/ingredientsRouter';
import {PostgresDb} from './db/postgresDb';

export function installRoutes(app: Application) {
  app.use('/recipes', recipesRouter);
  app.use('/ingredients', ingredientsRouter);
  clearDb(app);
  createTables(app);
}
function clearDb(app: Application) {
  app.delete('/all', async (req, res) => {
    try {
      const result = await PostgresDb.query(
        `DROP TABLE IF EXISTS recipe_instruction;
        DROP TABLE IF EXISTS recipe_ingredient;
        DROP TABLE IF EXISTS recipe_tag;
        DROP TABLE IF EXISTS ingredient CASCADE;
        DROP TABLE IF EXISTS recipe;`
      );
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send('Error deleting tables');
    }
  });
}

function createTables(app: Application) {
  app.post('/all', async (req, res) => {
    try {
      const result = await PostgresDb.query(createTablesQuery);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send('Error deleting tables');
    }
  });
}
const createTablesQuery = `
CREATE TABLE recipe (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE recipe_tag (
	id SERIAL PRIMARY KEY,
	recipe_id INT NOT NULL,
	tag VARCHAR(255) NOT NULL,
	FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
);

CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    unit VARCHAR(50) NOT NULL,
    fat DECIMAL(10, 2) NOT NULL,
    carbohydrates DECIMAL(10, 2) NOT NULL,
    protein DECIMAL(10, 2) NOT NULL,
    serving_size INT NOT NULL
);

CREATE TABLE recipe_ingredient (
    recipe_id INT,
    ingredient_id INT,
    unit VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

CREATE TABLE recipe_instruction (
    instruction_id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE
);`;
