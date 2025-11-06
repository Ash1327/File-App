import express from 'express';
import { userController, userValidate } from '../modules/user/index.js';

const router = express.Router();

// POST /api/users - Create user
router.post('/', 
  userValidate.validateCreateUser,
  userController.createUser
);

export default router;

