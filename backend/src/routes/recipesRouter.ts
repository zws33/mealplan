import {Router} from 'express';
import {
  GetRecipesQueryParams,
  GetRecipesQuerySchema,
  RecipeRepository,
} from '../recipeRepository/recipeRepository';
import {InMemoryRecipeRepository} from '../recipeRepository/inMemoryRecipeRepository';
import {ZodError} from 'zod';

const FILE_PATH = process.env.FILE_PATH;
const repository: RecipeRepository = new InMemoryRecipeRepository(FILE_PATH);

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
