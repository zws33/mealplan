import express, {Application, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {ingredientsRouter} from './recipes/routes/ingredientsRouter';

const app: Application = express();

const corsOptions = {
  origin: '*',
  optionsSucessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(ingredientsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
