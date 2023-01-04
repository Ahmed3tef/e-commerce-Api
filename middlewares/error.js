import fs from 'fs';
export const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (req.file)
    fs.unlink(req.file.path, err => {
      console.log(err);
    });

  if (process.env.NODE_ENV === 'development') return errorForDev(err, res);
  errorForProd(err, res);
};

// شكل الايرور اللي عايزه يرجع ف الرسبونس لو انا شغال ف الديفلوبمنت كباك
const errorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack, // this tells me where did error happen.
  });
};

// لما اخلص المشروع دا شكل الداتا اللي المفروض هترجع للفرونت

const errorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
