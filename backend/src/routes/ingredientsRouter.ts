import {Router} from 'express';
import {IngredientSchema} from '../models/models';
import {DatabaseError} from 'pg';
import {z, ZodError} from 'zod';
import {recipeService} from '../services/recipeService';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  const inputSchema = IngredientSchema.omit({id: true});
  try {
    const ingredientInput = inputSchema.parse(req.body);
    const result = await recipeService.createIngredient(ingredientInput);
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
  try {
    const id = parseInt(req.params.id);
    const result = await recipeService.findIngredientById(id);
    res.json(result);
  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(error);
      res.status(404).send('Ingredient not found');
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

ingredientsRouter.get('/search', async (req, res) => {
  try {
    const query = z.string().parse(req.query.q);
    const result = await recipeService.searchIngredients(query);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
