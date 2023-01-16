// routes
import categoryRoutes from './category.js';
import subCategoryRoutes from './subCategory.js';
import brandsRoutes from './brand.js';
import productsRoutes from './product.js';
import usersRoutes from './users.js';
import userInfoRoutes from './userInfo.js';
import authRoutes from './auth.js';
import reviewsRoutes from './review.js';
import wishlistRoutes from './wishlist.js';
import addressRoutes from './address.js';
import couponRoutes from './coupon.js';
import cartRoutes from './cart.js';
import orderRoutes from './order.js';

export const appRoutes = app => {
  // app routes
  app.use('/auth', authRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/subcategories', subCategoryRoutes);
  app.use('/brands', brandsRoutes);
  app.use('/products', productsRoutes);
  // user info for admin
  app.use('/users', usersRoutes);
  // user info for user
  app.use('/user', userInfoRoutes);
  app.use('/reviews', reviewsRoutes);
  app.use('/wishlist', wishlistRoutes);
  app.use('/address', addressRoutes);
  app.use('/coupons', couponRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);
};
