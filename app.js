import express from 'express';
import dotenv from 'dotenv';
// import morgan from 'morgan';
import bodyParser from 'body-parser';
import ApiError from './utils/ApiError.js';
import path from 'path';
import { globalError } from './middlewares/error.js';
import { dbConnection } from './utils/dbConnection.js';
import { appRoutes } from './routes/index.js';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import compression from 'compression';

import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

// routes are implemented in routes/index.js

dotenv.config({ path: './config.env' });

// if (process.env.NODE_ENV === 'development') {
//   // فايدتها انها بتطبع الركوستات والحالة بتاعتها ف الكونسول
//   app.use(morgan('dev'));
// }
const app = express();

app.use(cors());

// compress responses
app.use(compression());

app.use(bodyParser.json({ limit: '1mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// To remove data using these defaults: عشان لو جاي داتا علي اساس انه اوبجكت او مونجو اوبريتور ف دا هيبوظ الدنيا وممكن يخلي الهاكر يدخل علي اي ايميل بيماتش مع الباسورد مثلا
app.use(mongoSanitize());

app.use(hpp({ whitelist: ['price', 'avgRating', 'ratings', 'quantity'] })); // <- عشان لو جاي اكتر  من قيمة لنفس الحاجة ف الكويري او البادي او اي حتة ياخد بس اخر قيمة مياخدهمش الاتنين

// path.resolve() === __dirname in CommonJS
app.use(express.static(path.join(path.resolve(), 'uploads')));

// env vars
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

// Apply the rate limiting middleware to all requests
app.use('/auth', limiter);

// app routes
appRoutes(app);
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
