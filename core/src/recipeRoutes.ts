import {Application, Request, Response} from 'express';
import * as recipeRepository from './recipes/recipeRepository';

export function recipeRoutes(app: Application): void {
  app.post('/ingredients', createIngredient);
  app.get('/ingredients', getNutrition);
  app.get('/ingredients/:id', getIngredientById);
  app.put('/ingredients/:id', updateIngredient);
  app.delete('/ingredients/:id', deleteIngredient);
}

async function createIngredient(req: Request, res: Response) {
  console.log(req.body);
  const ingredient = await recipeRepository.createIngredient(req.body);
  res.send(ingredient);
}

async function getNutrition(req: Request, res: Response) {
  const nutrition = await recipeRepository.getIngredients();
  res.send(nutrition);
}

async function getIngredientById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ingredient = await recipeRepository.getIngredientById(id);
  res.send(ingredient);
}

async function updateIngredient(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ingredient = await recipeRepository.updateIngredient(id, req.body);
  res.send(ingredient);
}

async function deleteIngredient(req: Request, res: Response) {
  const id = Number(req.params.id);
  const ingredient = await recipeRepository.deleteIngredient(id);
  res.send(ingredient);
}
