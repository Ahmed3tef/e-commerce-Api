import { Schema, model } from 'mongoose';
import { ProductModel } from './product.js';
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      maxlength: [60, 'Too long name'],
    },
    comment: {
      type: String,
      minlength: [10, 'Too short name'],
      maxlength: [200, 'Too long name'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: [0, 'min rating value is 0.0'],
      max: [5, 'max rating value is 5.0'],
      default: 0,
    },
    user: {
      type: Schema.ObjectId,
      required: [true, 'user Id is required'],
      ref: 'User',
    },
    product: {
      type: Schema.ObjectId,
      required: [true, 'product Id is required'],
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email phone' });
  next();
});

reviewSchema.statics.createAverageRatingAndQuantity = async function (
  productId
) {
  // اجريجيت دي شغالة علي انها بتدخل النتايج بتاعتنا علي اكتر من مرحلة ورا بعض بالترتيب وكل مرحلة بتاخد النتيجة بتاعة المرحلة اللي قبلها وبتعمل عليها العمليات بتاعتها وهكذا

  const result = await this.aggregate([
    // stage 1 : get all reviews in specific product
    { $match: { product: productId } },
    // stage 2 : group reviews in based on specific product and calc avgRating and ratingQuantity
    {
      $group: {
        _id: 'product',
        averageRating: { $avg: '$rating' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      avgRating: result[0].averageRating,
      ratings: result[0].ratingsQuantity,
    });
  }
  // else {
  //   await ProductModel.findByIdAndUpdate(productId, {
  //     avgRating: 0,
  //     ratings: 0,
  //   });
  // }
};

reviewSchema.post('save', async function (next) {
  // بمرر ال productId اللي موجود ف الريفيو نفسه بتاع البرودكت
  await this.constructor.createAverageRatingAndQuantity(this.product);
  // next();
});
reviewSchema.post('remove', async function (next) {
  // بمرر ال productId اللي موجود ف الريفيو نفسه بتاع البرودكت
  await this.constructor.createAverageRatingAndQuantity(this.product);
  // next();
});

export const ReviewModel = model('Review', reviewSchema);
