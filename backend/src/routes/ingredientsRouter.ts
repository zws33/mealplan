import {Router} from 'express';
import {Ingredient, IngredientSchema} from '../models/models';
import {repository} from '../recipeRepository/postgresIngredientRepository';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  const inputSchema = IngredientSchema.omit({id: true});
  const ingredientInput = inputSchema.parse(req.body);
  try {
    const result = await repository.insertIngredient(ingredientInput);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send('Bad request');
    return;
  }
});

ingredientsRouter.post('/seed', async (req, res) => {
  const inputSchema = IngredientSchema.omit({id: true});
  const input: Ingredient[] = req.body.ingredients.map((ingredient: unknown) =>
    inputSchema.parse(ingredient)
  );
  try {
    const results: Ingredient[] = [];
    for (const ingredient of input) {
      const result = await repository.insertIngredient(ingredient);
      results.push(result);
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(400).send('Bad request');
    return;
  }
});

ingredientsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result: Ingredient = await repository.getIngredientById(id);
  res.json(result);
});
