import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

javascript
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

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});