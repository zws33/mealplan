import {Application} from 'express';
import {recipesRouter} from './routes/recipesRouter';

export function installRoutes(app: Application) {
  app.use('/recipes', recipesRouter);
}
