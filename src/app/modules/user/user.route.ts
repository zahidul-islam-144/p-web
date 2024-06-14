import express from 'express';
import { userController } from './user.controller';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
import userValidationSchemaToCreate from './user.validationSchemaToCreate';
const userRoutes = express.Router();

const { createUser, createAdmin } = userController;

userRoutes.post(
  '/register',
  requestValidationMiddleware(userValidationSchemaToCreate),
  createUser,
);

userRoutes.post(
  '/create-admin',
  requestValidationMiddleware(userValidationSchemaToCreate),
  createAdmin,
);


export default userRoutes;