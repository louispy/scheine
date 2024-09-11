import express from "express";
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'))

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Node Express!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
