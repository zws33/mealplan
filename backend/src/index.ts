import express, {Application, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {ingredientsRouter} from './recipes/routes/ingredientsRouter';
import {recipesRouter} from './recipes/routes/recipesRouter';

const app: Application = express();

const corsOptions = {
  origin: '*',
  optionsSucessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('common'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/ingredients', ingredientsRouter);
app.use('/recipes', recipesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
