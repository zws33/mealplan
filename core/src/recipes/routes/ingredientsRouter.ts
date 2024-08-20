import {Router} from 'express';
import * as repository from '../ingredientsRepository';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  console.log(req.body);
  const ingredient = await repository.createIngredient(req.body);
  res.send(ingredient);
});

ingredientsRouter.get('/', async (req, res) => {
  const nutrition = await repository.getIngredients();
  res.send(nutrition);
});

ingredientsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ingredient = await repository.getIngredientById(id);
  res.send(ingredient);
});

ingredientsRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ingredient = await repository.updateIngredient(id, req.body);
  res.send(ingredient);
});

ingredientsRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ingredient = await repository.deleteIngredient(id);
  res.send(ingredient);
});
