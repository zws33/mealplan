import {Router} from 'express';
import {ZodError} from 'zod';
import {DatabaseError} from 'pg';
import {RecipeInputSchema, RecipeTagSchema} from '../models/models';
import {recipeService} from '../services/recipeService';

export const recipesRouter = Router();

recipesRouter.get('/', async (req, res) => {
  try {
    const tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
    const query = {
      tags: RecipeTagSchema.array().parse(tags),
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const recipes = await recipeService.findAllRecipes(query);
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
  try {
    const recipe = RecipeInputSchema.parse(req.body);
    const result = await recipeService.createRecipe(recipe);
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
    const recipe = await recipeService.findRecipeById(parseInt(id));
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
