import mongoose from 'mongoose';

export const dbConnection = () => {
  const CONNECTION_URL =
    process.env.SERVER || 'mongodb://localhost:27017/e-commerce-app';

  mongoose.set('strictQuery', false);

  mongoose
    .connect(CONNECTION_URL, {
      useNewUrlParser: true,
    })
    .then(conn => {
      console.log(`connected at: ${conn.connection.host}`);
    });
  // .catch(err => console.log('error happened' + err)); don't catch it so we can catch it at unhandledRejections
};
