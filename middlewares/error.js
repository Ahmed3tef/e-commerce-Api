export const globalError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    message: err.message,
    error: err,
    stack: err.stack, // this tells me where did error happen.
  });
};
