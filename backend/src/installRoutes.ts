import {Application} from 'express';
import {recipesRouter} from './routes/recipesRouter';
import {ingredientsRouter} from './routes/ingredientsRouter';

export function installRoutes(app: Application) {
  app.use('/recipes', recipesRouter);
  app.use('/ingredients', ingredientsRouter);
}
