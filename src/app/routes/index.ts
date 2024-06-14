import { Router } from 'express';
import categoryRoutes from '../modules/category/category.routes';
import courseRoutes from '../modules/course/course.routes';
import reviewRoutes from '../modules/review/review.routes';
import userRoutes from '../modules/user/user.route';
import authRoutes from '../modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/categories',
    routes: categoryRoutes,
  },
  {
    path: '/categories',
    routes: categoryRoutes,
  },
  {
    path: '/course',
    routes: courseRoutes
  },
  {
    path: '/courses',
    routes: courseRoutes
  },
  {
    path: '/reviews',
    routes: reviewRoutes
  },
  {
    path: '/auth',
    routes: userRoutes
  },
  {
    path: '/auth',
    routes: authRoutes
  }
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.routes));

export default router;