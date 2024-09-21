import {Router} from 'express';
import {
  GetRecipesQueryParams,
  GetRecipesQuerySchema,
} from '../recipeRepository/recipeRepository';
import {ZodError} from 'zod';
import {repository} from '../recipeRepository/postgresIngredientRepository';
import {RecipeSchema} from '../models/models';

export const recipesRouter = Router();

recipesRouter.get('/', async (req, res) => {
  let query: GetRecipesQueryParams;
  try {
    query = GetRecipesQuerySchema.parse(req.query);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422).json({error: error.errors[0].message});
    } else {
      res.status(500).send('Internal server error');
    }
    return;
  }
  const recipes = await repository.getRecipes(query);
  if (!recipes) {
    res.status(404).send('Recipe not found');
    return;
  } else {
    res.json(recipes);
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
  const recipe = await repository.getRecipeById(parseInt(id));
  if (!recipe) {
    res.status(404).send('Recipe not found');
    return;
  } else {
    res.json(recipe);
  }
});
