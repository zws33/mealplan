import {Router} from 'express';
import {ZodError} from 'zod';
import {repository} from '../recipeRepository/postgresRepository';
import {RecipeSchema, RecipeTagSchema} from '../models/validators';
import {DatabaseError} from 'pg';
import {RecipeRequestParams} from '../recipeRepository/recipeRepository';

export const recipesRouter = Router();

recipesRouter.get('/', async (req, res) => {
  try {
    const tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
    const query: RecipeRequestParams = {
      tags: RecipeTagSchema.array().parse(tags),
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const recipes = await repository.getRecipes(query);
    if (!recipes) {
      res.status(404).send('Recipe not found');
      return;
    } else {
      res.json(recipes);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({error: error.errors[0].message});
    } else if (error instanceof DatabaseError) {
      console.error(error.code);
      res.status(500).send('Database error');
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

recipesRouter.post('/', async (req, res) => {
  const recipe = RecipeSchema.omit({id: true}).parse(req.body);
  try {
    const result = await repository.createRecipe(recipe);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send('Bad request');
    return;
  }
});

recipesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const recipe = await repository.getRecipeById(parseInt(id));
    if (!recipe) {
      res.status(404).send('Recipe not found');
      return;
    } else {
      res.json(recipe);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error);
    }
    res.status(500).send('Internal server error');
  }
});
