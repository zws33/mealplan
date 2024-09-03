import {Router} from 'express';
import {
  GetRecipesQueryParams,
  GetRecipesQuerySchema,
  InMemoryRecipeRepository,
  RecipeRepository,
} from '../recipeRepository/recipeRepository';
import {ZodError} from 'zod';

const repository: RecipeRepository = new InMemoryRecipeRepository(
  process.env.FILE_PATH
);

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
