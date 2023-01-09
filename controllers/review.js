import { ReviewModel } from '../models/reviews.js';
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  getOneHandler,
  updateHandler,
} from './crud-handlres.js';

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
