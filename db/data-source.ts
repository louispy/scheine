import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URI,
  type: 'postgres',
  entities: ['entity/**/*.ts'],
  migrations: ['migration/**/*.ts'],
  subscribers: ['subscriber/**/*.ts'], // Path to subscriber files
  logging: true,
});
