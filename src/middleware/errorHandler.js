// Express's built-in error handler replies with an HTML page
// Frontend expects JSON like { error: "Invalid email format" } so it can show the message

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
