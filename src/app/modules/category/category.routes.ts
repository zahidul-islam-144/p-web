import express from 'express';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
import { categoryController } from './category.controller';
import categoryValidationSchema from './category.validationSchemaToCreate';
import isAuthenticated from '../../middlewares/isAuthenticated';
import authorizationRole from '../../middlewares/authorizationRole';
import { USER_ROLE } from '../user/user.interface';
const categoryRoutes = express.Router();

const { createCategory, getAllCategories } = categoryController;

categoryRoutes.post(
  '/',
  isAuthenticated,
  authorizationRole(USER_ROLE.admin),
  requestValidationMiddleware(categoryValidationSchema),
  createCategory,
);

categoryRoutes.get(
  '/',
  getAllCategories,
);

export default categoryRoutes;
// authRouter.route("/register").get(register);
