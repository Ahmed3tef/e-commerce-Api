require('colors');
import dotenv from 'dotenv';
import { dbConnection } from '../dbConnection.js';
import { ProductModel } from '../../models/product';
import fs from 'fs';

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));

// Insert data into DB
const insertData = async () => {
  try {
    await ProductModel.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -i to add dummy products to database
// node seeder.js -d to clear  products in database
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}

// كل مهمة الفايل دا انه يمسح الداتا اللي موجودة ف مكان معين انت هتديهوله او يحط داتا من فايل انت هتديهوله ويضيفه ع الداتا بيز
