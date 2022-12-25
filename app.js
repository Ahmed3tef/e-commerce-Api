import express from 'express';
import dotenv from 'dotenv';
// import morgan from 'morgan';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import categoryRoutes from './routes/category.js';
import ApiError from './utils/ApiError.js';
import { globalError } from './middlewares/error.js';

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
const CONNECTION_URL =
  process.env.SERVER || 'mongodb://localhost:27017/e-commerce-app';

// app routes

app.use('/categories', categoryRoutes);

// route doesn't match
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`));
});

// error handler middleware
app.use(globalError);

// db connection

mongoose.set('strictQuery', false);
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log('App is running on port: ' + PORT));
  })
  .catch(err => console.log('error happened' + err));
