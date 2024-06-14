import express from 'express';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
import { reviewController } from './review.controller';
import reviewSchemaToCreate from './review.validationSchemaToCreate';
import isAuthenticated from '../../middlewares/isAuthenticated';
import authorizationRole from '../../middlewares/authorizationRole';
import { USER_ROLE } from '../user/user.interface';
const reviewRoutes = express.Router();

const { createReview } = reviewController;

reviewRoutes.post(
  '/',
  isAuthenticated,
  authorizationRole(USER_ROLE.user),
  requestValidationMiddleware(reviewSchemaToCreate),
  createReview
);


export default reviewRoutes;
// authRouter.route("/register").get(register);
