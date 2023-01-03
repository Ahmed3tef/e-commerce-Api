import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import { v4 as uuid4 } from 'uuid';
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

const multerOptions = () => {
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
  return upload;
};

export const uploadSingleImage = fileName => multerOptions().single(fileName);

export const uploadMultipleImages = fields => multerOptions().fields(fields);

export const refactorAndSaveImage = folderName =>
  asyncHandler(async (req, res, next) => {
    const fileName = `${uuid4()}-${Date.now()}.jpeg`;

    if (req.files?.mainImage) {
      await sharp(req.files.mainImage[0].buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/${folderName}/${fileName}`);

      req.body.mainImage = `${folderName}/${fileName}`;
    }

    if (req.files?.images) {
      // initialize it so you can push to it.
      req.body.images = [];
      // must be promise so we can await for the code data before going to next step
      await Promise.all(
        req.files.images.map(async img => {
          const imgName = `${uuid4()}-${Date.now()}.jpeg`;
          await sharp(img.buffer)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/${folderName}/${imgName}`);

          req.body.images.push(`${folderName}/${imgName}`);
        })
      );
    }

    if (req.file) {
      await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/${folderName}/${fileName}`);

      req.body.image = `${folderName}/${fileName}`;
    }
    next();
  });
