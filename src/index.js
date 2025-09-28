import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

import apiRoutes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Zbyt wiele zapytań z tego adresu IP, spróbuj ponownie za 15 minut',
});

app.use('/api', limiter);

app.get('/', (req, res) => {
  res.send('API sklepu meblowego działa!');
});

app.use('/api', apiRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});