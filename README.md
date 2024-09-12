# SCHEINE API

Built with Node, Typescript, Express, TypeORM

## Setup

1. Requirement: Node version 20+; PostgreSQL
2. Copy .env.example into .env and add your PostgreSQL DATABASE_URI
3. Install dependencies
```
npm install
```
4. Migrate Database Schema, seed patient & doctor
```
npm run migration:up
npm run seed
```
5. Build and Run App
```
npm run dev
```