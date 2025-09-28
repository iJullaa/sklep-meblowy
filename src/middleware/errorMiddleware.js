import ApiError from '../utils/ApiError.js';

export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);

  return res.status(500).json({ message: 'Wystąpił nieoczekiwany błąd serwera' });
};