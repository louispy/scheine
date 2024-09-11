import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import { AppDataSource } from './db/data-source';

const bootstrap = async () => {
  dotenv.config();
  await AppDataSource.initialize().catch((err) => {
    console.error('err', err);
    throw err;
  });
  console.log('data source initialized');

  const app = express();
  const port = 5000;

  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny'));

  app.get('/', (req, res) => {
    res.send('Hello, TypeScript Node Express!');
  });


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

bootstrap();
