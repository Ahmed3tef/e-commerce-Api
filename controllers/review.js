import { ReviewModel } from '../models/reviews.js';
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

// nested route
// GET products/:productId/reviews/
export const createFilterObjForNested = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) filterObj = { product: req.params.productId };
  req.filterObj = filterObj;
  next();
};

// nested route (create)
export const setProductIdAndUserId = (req, res, next) => {
  // هنا بقوله انك مش محتاج تمرر البرودكت اي دي ولا اليوزر اي دي ف ال body

  if (req.params.productId) {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
  }
  next();
};

// get all brends
export const getReviews = getAllHandler(ReviewModel);

// get one Review
export const getReview = getOneHandler(ReviewModel, 'Review');

// create Review
export const createReview = createHandler(ReviewModel);

// update Review

export const updateReview = updateHandler(ReviewModel, 'Review');

// update Review

export const deleteReview = deleteHandler(ReviewModel, 'Review');
