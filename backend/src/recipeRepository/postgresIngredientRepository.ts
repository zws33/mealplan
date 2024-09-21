import {Pool} from 'pg';
import {PostgresDb} from '../db/postgresDb';
import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeSchema,
} from '../models/models';
import {GetRecipesQueryParams, Repository} from './recipeRepository';
import {readFileSync} from 'fs';

export class PostgresRepository implements Repository {
  constructor(private readonly db: Pool) {}
  async createRecipe(recipeInput: RecipeInput) {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');
      const recipeResult = await client.query<{id: number; name: string}>(
        `INSERT INTO recipe (name) 
        VALUES ($1) 
        RETURNING *`,
        [recipeInput.name]
      );
      for (const quantifiedIngredient of recipeInput.ingredients) {
        await client.query(
          `INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity, unit) 
          VALUES ($1, $2, $3, $4)`,
          [
            recipeResult.rows[0].id,
            quantifiedIngredient.ingredient.id,
            quantifiedIngredient.quantity,
            quantifiedIngredient.unit,
          ]
        );
      }
      for (const instruction of recipeInput.instructions) {
        await client.query(
          `INSERT INTO recipe_instruction (recipe_id, step_number, description) 
          VALUES ($1, $2, $3)`,
          [recipeResult.rows[0].id, instruction.step, instruction.description]
        );
      }
      for (const tag of recipeInput.tags) {
        await client.query(
          `INSERT INTO recipe_tag (recipe_id, tag) 
          VALUES ($1, $2)`,
          [recipeResult.rows[0].id, tag]
        );
      }
      client.query('COMMIT');
      return {
        recipe: {
          id: recipeResult.rows[0].id,
          name: recipeResult.rows[0].name,
          ingredients: recipeInput.ingredients,
          instructions: recipeInput.instructions,
          tags: recipeInput.tags,
        },
      };
    } catch (e) {
      client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const recipeName = await this.db.query(
      'SELECT name FROM recipe WHERE id = $1',
      [id]
    );
    if (!recipeName.rows[0]) {
      throw new Error('Recipe not found');
    }
    const ingredientRows = await this.db.query(
      `SELECT *
        FROM recipe_ingredient ri
        JOIN ingredient i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = $1;`,
      [id]
    );
    const quantifiedIngredients = ingredientRows.rows.map(row => {
      return {
        unit: row.unit,
        quantity: row.quantity,
        ingredient: {
          id: row.ingredient_id,
          name: row.name,
          unit: row.unit,
          fat: row.fat,
          carbohydrates: row.carbohydrates,
          protein: row.protein,
          serving_size: row.serving_size,
        },
      };
    });
    const instructionRows = await this.db.query(
      'SELECT * FROM recipe_instruction WHERE recipe_id = $1',
      [id]
    );
    const instructions = instructionRows.rows.map(row => {
      return {
        step: row.step_number,
        description: row.description,
      };
    });
    const tagRows = await this.db.query(
      'SELECT tag FROM recipe_tag WHERE recipe_id = $1',
      [id]
    );

    return {
      id,
      name: recipeName.rows[0].name,
      ingredients: quantifiedIngredients,
      instructions: instructions,
      tags: tagRows.rows.map(row => row.tag),
    };
  }
  updateRecipe(recipe: Recipe): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }
  async deleteRecipe(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM recipe WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  }
  async getRecipes(queryParams: GetRecipesQueryParams): Promise<Recipe[]> {
    throw new Error('Method not implemented.');
  }
  async insertIngredient(ingredient: IngredientInput): Promise<Ingredient> {
    const result = await PostgresDb.query<Ingredient>(
      `INSERT INTO ingredient (name, fat, carbohydrates, protein, serving_size, unit) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
      [
        ingredient.name,
        ingredient.fat,
        ingredient.carbohydrates,
        ingredient.protein,
        ingredient.serving_size,
        ingredient.unit,
      ]
    );
    return result.rows[0];
  }
  async getIngredientById(id: number): Promise<Ingredient> {
    const result = await PostgresDb.query<Ingredient>(
      'SELECT * FROM ingredient WHERE id = $1',
      [id]
    );
    result.rows.map(ingredient => {
      return {
        name: ingredient.name,
        fat: ingredient.fat,
        carbohydrates: ingredient.carbohydrates,
        protein: ingredient.protein,
        serving_size: ingredient.serving_size,
        unit: ingredient.unit,
      };
    });
    return result.rows[0];
  }
}

export const repository = new PostgresRepository(PostgresDb);

export async function populateDatabase() {
  try {
    const ingredientsJson = readFileSync('./src/db/ingredients.json', 'utf-8');
    const ingredients: Ingredient[] = JSON.parse(ingredientsJson);
    const recipeData = readFileSync('./src/db/recipes.json', 'utf-8');
    const recipes: Recipe[] = JSON.parse(recipeData);

    for (const ingredient of ingredients) {
      await repository.insertIngredient(ingredient);
    }
    for (const recipe of recipes) {
      await repository.createRecipe(recipe);
    }
  } catch (e) {
    console.error(e);
  }
}
