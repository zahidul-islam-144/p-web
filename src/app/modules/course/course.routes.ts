import express from 'express';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
import { courseController } from './course.controller';
import courseValidationSchema from './course.validationSchemaToCreate';
import isAuthenticated from '../../middlewares/isAuthenticated';
import authorizationRole from '../../middlewares/authorizationRole';
import { USER_ROLE } from '../user/user.interface';
const courseRoutes = express.Router();

const {
  createCourse,
  getCourseByQuerying,
  getCourseById,
  getBestCourse,
  updateCourse,
} = courseController;

courseRoutes.post(
  '/',
  isAuthenticated,
  authorizationRole(USER_ROLE.admin),
  requestValidationMiddleware(courseValidationSchema),
  createCourse,
);

courseRoutes.get('/', getCourseByQuerying);
courseRoutes.get('/:courseId/reviews', getCourseById);
courseRoutes.get('/best', getBestCourse);
courseRoutes.put(
  '/:targetId',
  isAuthenticated,
  authorizationRole(USER_ROLE.admin),
  updateCourse,
);

export default courseRoutes;
// authRouter.route("/register").get(register);
