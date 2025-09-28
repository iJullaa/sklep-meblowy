import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());

app.get('/', (req, res) => {
  res.send('API sklepu meblowego działa!');
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
  message: 'Zbyt wiele zapytań z tego adresu IP, spróbuj ponownie za 15 minut',
});

app.use('/api', limiter);

