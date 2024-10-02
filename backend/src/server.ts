import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {installRoutes} from './installRoutes';
import {initializeDatabase} from './db/postgresDb';

export async function startServer() {
  const app: Application = express();

  const corsOptions = {
    origin: '*',
    optionsSucessStatus: 200,
  };

  app.use(cors(corsOptions));
  const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
  app.use(morgan(logFormat));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // await initializeDatabase();
  installRoutes(app);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
