-- init.sql
DROP TABLE IF EXISTS recipe_instructions;
DROP TABLE IF EXISTS nutrition;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL
);

CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    unit VARCHAR(50),
    quantity DECIMAL(10, 2),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE nutrition (
    ingredient_id INT,
    unit VARCHAR(50),
    calories DECIMAL(10, 2),
    fat DECIMAL(10, 2),
    carbs DECIMAL(10, 2),
    protein DECIMAL(10, 2),
    PRIMARY KEY (ingredient_id, unit),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE recipe_instructions (
    instruction_id SERIAL PRIMARY KEY,
    recipe_id INT,
    step_number INT,
    description TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
);