export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[API Error] ${err.message}`, err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Clinical Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
