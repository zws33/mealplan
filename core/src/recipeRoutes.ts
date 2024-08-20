import {Application} from 'express';

export function recipeRoutes(app: Application): void {
  app.post('/ingredients', (req, res) => {
    res.send('Create a new recipe');
  });
}
