import {Router} from 'express';
import * as repository from '../recipesRepository';

export const recipesRouter = Router();

recipesRouter.post('/', async (req, res) => {
  const recipe = await repository.createRecipe(req.body);
  res.send(recipe);
});

recipesRouter.get('/', async (req, res) => {
  const recipes = await repository.getRecipes();
  res.send(recipes);
});
