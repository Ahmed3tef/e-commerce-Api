import { Router } from 'express';
import { accessAllowedTo, tokenProtection } from '../controllers/auth.js';
import {
  createCashOrder,
  filterOrderForLoggedUser,
  getAllOrders,
  getOneOrder,
  payWithCard,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/order.js';

const router = Router();

// must be valid logged in user and only user can access this route
router.use(tokenProtection);

// (user, admin, manager) can access all orders
router
  .route('/')
  .get(
    accessAllowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    getAllOrders
  );

router
  .route('/:id/pay')
  .patch(accessAllowedTo('admin', 'manager'), updateOrderToPaid);

router
  .route('/:id/deliver')
  .patch(accessAllowedTo('admin', 'manager'), updateOrderToDelivered);

router.use(accessAllowedTo('user'));

router.route('/create').post(createCashOrder);
router.route('/checkout').post(payWithCard);

router.route('/:id').get(getOneOrder);

export default router;
