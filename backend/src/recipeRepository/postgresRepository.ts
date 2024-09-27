import {db} from '../db/postgresDb';
import {
  Ingredient,
  IngredientInput,
  Recipe,
  RecipeInput,
  RecipeRequestParams,
  RecipeTag,
  RecipeTags,
} from '../models/models';
import {RecipeRepository} from './recipeRepository';
import {Kysely} from 'kysely';
import {DB} from '../db/kysely-types';

export class PostgresRepository implements RecipeRepository {
  constructor(private readonly db: Kysely<DB>) {}
  async createRecipe(recipeInput: RecipeInput) {
    const txn = await this.db.transaction().execute(async txn => {
      const recipe = await txn
        .insertInto('recipe')
        .values({name: recipeInput.name})
        .returningAll()
        .executeTakeFirstOrThrow();
      const recipeIngredients = recipeInput.ingredients.map(
        quantifiedIngredient => {
          return {
            recipeId: recipe.id,
            ingredientId: quantifiedIngredient.ingredient.id,
            quantity: quantifiedIngredient.quantity,
            unit: quantifiedIngredient.unit,
          };
        }
      );
      await txn
        .insertInto('recipeIngredient')
        .values(recipeIngredients)
        .returningAll()
        .execute();

      const recipeInstructions = recipeInput.instructions.map(instruction => {
        return {
          recipeId: recipe.id,
          ...instruction,
        };
      });
      await txn
        .insertInto('recipeInstruction')
        .values(recipeInstructions)
        .returningAll()
        .execute();

      const recipeTags = recipeInput.tags.map(tag => {
        return {
          recipeId: recipe.id,
          tag,
        };
      });
      await txn
        .insertInto('recipeTag')
        .values(recipeTags)
        .returningAll()
        .execute();

      const insertedRecipe: Recipe = {
        id: recipe.id,
        name: recipeInput.name,
        ingredients: recipeInput.ingredients,
        instructions: recipeInput.instructions,
        tags: recipeInput.tags,
      };
      return insertedRecipe;
    });
    return txn;
  }

  async findRecipeById(id: number): Promise<Recipe | undefined> {
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

  async findAllRecipes(queryParams: RecipeRequestParams): Promise<Recipe[]> {
    const recipeIds =
      queryParams.tags !== undefined
        ? await this.db
            .selectFrom('recipeTag')
            .innerJoin('recipe', 'recipeTag.recipeId', 'recipe.id')
            .select('recipe.id')
            .where('recipeTag.tag', 'in', queryParams.tags)
            .limit(queryParams.limit ?? 10)
            .execute()
        : [];

    const recipes: Recipe[] = [];
    for (const id of recipeIds) {
      const recipe = await this.findRecipeById(id.id);
      if (recipe) {
        recipes.push(recipe);
      }
    }
    return recipes;
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

  async findIngredientById(id: number): Promise<Ingredient> {
    const result = await this.db
      .selectFrom('ingredient')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return result;
  }
}

export const repository = new PostgresRepository(db);
