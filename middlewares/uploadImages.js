import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import { v4 as uuid4 } from 'uuid';
export const uploadSingleImage = fileName => {
  // create storage configration.

  // 1- desk storage
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/categories');
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split('/')[1];
  //     const fileName = `${uuid4()}-${Date.now()}.${ext}`;

  //     cb(null, fileName);
  //   },
  // });

  // 2- memory storage (makes a buffer)
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      // cb is like next in express, first arg is the error second is response
      cb(null, true);
    } else {
      cb(new ApiError('only images are allowed', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  return upload.single(fileName);
};

export const uploadMultipleImages = () => {};

export const refactorAndSaveImage = () =>
  asyncHandler(async (req, res, next) => {
    const fileName = `${uuid4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${fileName}`);

    req.body.image = fileName;
    next();
  });
