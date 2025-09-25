import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API sklepu meblowego działa!');
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});


