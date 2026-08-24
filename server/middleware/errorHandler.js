const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.status === 401) {
    message = 'AI service authentication failed. Check the GROQ_API_KEY configuration.';
  } else if (err.status === 429) {
    message = 'AI analysis is temporarily rate-limited. Please try again in a moment.';
  } else if (/model .*does not exist|model .*not found/i.test(err.message || '')) {
    message = 'The configured AI model is unavailable. Please contact support or try again later.';
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
