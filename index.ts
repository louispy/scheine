import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { AppDataSource } from './db/data-source';
import scheineRouter from './routes/scheine';
import scheineFormRouter from './routes/scheine-form';
import { getContainer } from './app';

const bootstrap = async () => {
  dotenv.config();
  await AppDataSource.initialize().catch((err) => {
    console.error('err', err);
    throw err;
  });
  console.log('data source initialized');

  const container = getContainer();
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));

  app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
  });

  app.use(scheineRouter(container));
  app.use(scheineFormRouter(container));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrap();
