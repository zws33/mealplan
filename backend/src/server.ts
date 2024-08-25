import express, {Application, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {installRoutes} from './installRoutes';

export function startServer() {
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

  installRoutes(app);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
