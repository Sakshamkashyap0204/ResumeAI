const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
