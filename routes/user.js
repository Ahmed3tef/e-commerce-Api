import { Router } from 'express';

import {
  createUser,
  createUserImage,
  deleteUser,
  getUser,
  getUsers,
  resizeUserImage,
  updateUser,
} from '../controllers/user.js';

// import {
//   createUserValidation,
//   deleteUserValidation,
//   getUserValidation,
//   updateUserValidation,
// } from '../utils/validations/User.js';

const router = Router();

router.get('/', getUsers);

router
  .route('/one/:id')
  .get(getUser)
  .patch(createUserImage, resizeUserImage, updateUser)
  .delete(deleteUser);

router.post('/create', createUserImage, resizeUserImage, createUser);

export default router;
