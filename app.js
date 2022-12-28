import express from 'express';
import dotenv from 'dotenv';
// import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ApiError from './utils/ApiError.js';
import { globalError } from './middlewares/error.js';
import { dbConnection } from './utils/dbConnection.js';
// routes
import categoryRoutes from './routes/category.js';
import subCategoryRoutes from './routes/subCategory.js';
import brandsRoutes from './routes/brand.js';
import productsRoutes from './routes/product.js';

dotenv.config({ path: './config.env' });

// if (process.env.NODE_ENV === 'development') {
//   // فايدتها انها بتطبع الركوستات والحالة بتاعتها ف الكونسول
//   app.use(morgan('dev'));
// }
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// env vars
const PORT = process.env.PORT || 5000;

// app routes

app.use('/categories', categoryRoutes);
app.use('/subcategories', subCategoryRoutes);
app.use('/brands', brandsRoutes);
app.use('/products', productsRoutes);

// route doesn't match
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`));
});

// error handler middleware
app.use(globalError);

// db connection
dbConnection();

// start server

const server = app.listen(PORT, () =>
  console.log('App is running on port: ' + PORT)
);

// handle rejections (errors from outside express)

process.on('unhandledRejection', err => {
  console.error(
    `unhandledRejection Error happened: ${err.name} | ${err.message}`
  );

  // هنعمل كلوز سرفر الاول عشان لو في اي عمليات الابلكيشن بيعملها يخلصها الاول وبعدين يعمل بروسس اكزت
  server.close(err => {
    console.log('server is shutting down...');
    process.exit(1);
  });
});
