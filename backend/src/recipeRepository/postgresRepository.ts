import {db} from '../db/postgresDb';
import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeTag,
  RecipeTags,
} from '../models/models';
import {RecipeRequestParams, Repository} from './recipeRepository';
import {readFileSync} from 'fs';
import {Kysely} from 'kysely';
import {DB} from '../db/kysely-types';

export class PostgresRepository implements Repository {
  constructor(private readonly db: Kysely<DB>) {}
  async createRecipe(recipeInput: RecipeInput) {
    const txn = await this.db.transaction().execute(async db => {
      const recipe = await db
        .insertInto('recipe')
        .values({name: 'test1'})
        .returningAll()
        .executeTakeFirstOrThrow();
      for (const quantifiedIngredient of recipeInput.ingredients) {
        await db
          .insertInto('recipeIngredient')
          .values({
            recipeId: recipe.id,
            ingredientId: quantifiedIngredient.ingredient.id,
            quantity: quantifiedIngredient.quantity,
            unit: quantifiedIngredient.unit,
          })
          .execute();
      }
      for (const instruction of recipeInput.instructions) {
        await db
          .insertInto('recipeInstruction')
          .values({
            recipeId: recipe.id,
            stepNumber: instruction.stepNumber,
            description: instruction.description,
          })
          .execute();
      }
      for (const tag of recipeInput.tags) {
        await db
          .insertInto('recipeTag')
          .values({
            recipeId: recipe.id,
            tag,
          })
          .execute();
      }
      return recipe;
    });
    return txn;
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    const recipe = await this.db
      .selectFrom('recipe')
      .select('name')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    const ingredientRows = await this.db
      .selectFrom('recipeIngredient')
      .innerJoin('ingredient', 'ingredient.id', 'recipeIngredient.ingredientId')
      .select([
        'recipeIngredient.unit as recipeUnit',
        'recipeIngredient.quantity as recipeQuantity',
        'ingredient.id',
        'ingredient.name',
        'ingredient.unit',
        'ingredient.servingSize',
        'ingredient.carbohydrates',
        'ingredient.protein',
        'ingredient.fat',
      ])
      .where('recipeId', '=', id)
      .execute();
    const quantifiedIngredients = ingredientRows.map(row => {
      return {
        unit: row.recipeUnit,
        quantity: row.recipeQuantity,
        ingredient: {
          id: row.id,
          name: row.name,
          unit: row.unit,
          servingSize: row.servingSize,
          carbohydrates: row.carbohydrates,
          protein: row.protein,
          fat: row.fat,
        },
      };
    });
    const instructions = await this.db
      .selectFrom('recipeInstruction')
      .select(['stepNumber', 'description'])
      .where('recipeId', '=', id)
      .execute();

    const tagRows = await this.db
      .selectFrom('recipeTag')
      .select('recipeTag.tag')
      .where('recipeTag.recipeId', '=', id)
      .execute();
    const tags = tagRows
      .map(row => row.tag)
      .filter((tag): tag is RecipeTag => RecipeTags.includes(tag as RecipeTag));
    return {
      id,
      name: recipe.name,
      ingredients: quantifiedIngredients,
      instructions: instructions,
      tags: tags,
    };
  }

  updateRecipe(recipe: Recipe): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await this.db
      .deleteFrom('recipe')
      .where('id', '=', id)
      .executeTakeFirst();
    return result.numDeletedRows > 0;
  }

  async getRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]> {
    throw new Error('Method not implemented.');
  }

  async createIngredient(ingredient: IngredientInput): Promise<Ingredient> {
    const result = await this.db
      .insertInto('ingredient')
      .values({
        name: ingredient.name,
        fat: ingredient.fat,
        carbohydrates: ingredient.carbohydrates,
        protein: ingredient.protein,
        servingSize: ingredient.servingSize,
        unit: ingredient.unit,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return result;
  }

  async getIngredientById(id: number): Promise<Ingredient> {
    const result = await this.db
      .selectFrom('ingredient')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return result;
  }
}

export const repository = new PostgresRepository(db);
