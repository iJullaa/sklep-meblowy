export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Coś poszło nie tak!' });
};
