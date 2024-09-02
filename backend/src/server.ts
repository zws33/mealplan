import express, {Application, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {installRoutes} from './installRoutes';
import {InMemoryRecipeRepository} from './recipeRepository/recipeRepository';
import {ModelGenerator} from './models/modelGenerator';
import {existsSync, writeFileSync} from 'fs';

export function startServer() {
  const app: Application = express();

  const corsOptions = {
    origin: '*',
    optionsSucessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(morgan('common'));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const filepath = './recipes.json';
  if (!existsSync(filepath)) {
    const recipes = new ModelGenerator().generateRecipes(100);
    const jsonString = JSON.stringify(recipes, null, 2);
    writeFileSync(filepath, jsonString, 'utf-8');
  }
  const repository = new InMemoryRecipeRepository(filepath);

  app.get('/api', async (req, res) => {
    const recipe = await repository.getRecipeById(96);
    res.json(recipe);
  });

  installRoutes(app);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
