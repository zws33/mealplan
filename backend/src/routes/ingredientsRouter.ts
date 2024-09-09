import {Router} from 'express';
import {IngredientSchema} from '../models/models';
import {
  createIngredient,
  getIngredientById,
} from '../recipeRepository/postgresIngredientRepository';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  const inputSchema = IngredientSchema.omit({id: true});
  const ingredientInput = inputSchema.parse(req.body);
  const result = await createIngredient(ingredientInput);
  res.json(result);
});

ingredientsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await getIngredientById(id);
  res.json(result);
});
