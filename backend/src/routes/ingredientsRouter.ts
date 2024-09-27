import {Router} from 'express';
import {Ingredient} from '../models/models';
import {repository} from '../recipeRepository/postgresRepository';
import {IngredientSchema} from '../models/models';
import {DatabaseError} from 'pg';
import {ZodError} from 'zod';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  const inputSchema = IngredientSchema.omit({id: true});
  try {
    const ingredientInput = inputSchema.parse(req.body);
    const result = await repository.createIngredient(ingredientInput);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({error: error});
    } else if (error instanceof DatabaseError) {
      console.error(error);
      res.status(409).send('Database conflict');
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

ingredientsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result: Ingredient = await repository.getIngredientById(id);
  res.json(result);
});
