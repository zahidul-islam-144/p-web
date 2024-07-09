import express from 'express';
import { authController } from './auth.controller';
import { authValidationSchema } from './auth.validation';
import requestValidationMiddleware from '../../middlewares/requestValidationMiddleware';
import { USER_ROLE } from '../user/user.interface';
import isAuthenticated from '../../middlewares/isAuthenticated';
import authorizationRole from '../../middlewares/authorizationRole';
const authRoutes = express.Router();

const { loginUser, changePassword, getNewAccessToken, logOutUser } = authController;
const { loginValidationSchema, changePasswordValidationSchema, refreshTokenValidation } = authValidationSchema;

authRoutes.post(
  '/login',
  requestValidationMiddleware(loginValidationSchema),
  loginUser,
);

authRoutes.post(
  '/change-password',
  isAuthenticated,
  authorizationRole(USER_ROLE.admin, USER_ROLE.user),
  requestValidationMiddleware(changePasswordValidationSchema),
  changePassword,
);

authRoutes.post(
  '/request-new-access-token',
  // requestValidationMiddleware(refreshTokenValidation),
  getNewAccessToken
)

authRoutes.get(
  '/logout-user/:id',
  // isAuthenticated, 
  logOutUser
)
export default authRoutes;




/*
send-cookie using comandline:

curl -X POST   http://localhost:8080/api/auth/refresh-token   -H 'Content-Type: application/json'   -H 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7Il9pZCI6IjY1OTQ5M2ViODQ1MDAyOGUxNGNlMjI2MiIsInVzZXJuYW1lIjoidXNlcl8xIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJfMUBleGFtcGxlLmNvbSIsImV4cCI6MTgwfSwiaWF0IjoxNzA0ODc2NDA0LCJleHAiOjE3MDQ4NzY1ODR9.t-aUUeewGRssPal8F6ovPsML8PvoMCXorbBANQTCGgQ'


curl -X POST   http://localhost:8080/api/auth/login   -H 'Content-Type: application/json'   -H 'Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7Il9pZCI6IjY1OTQ5M2ViODQ1MDAyOGUxNGNlMjI2MiIsInVzZXJuYW1lIjoidXNlcl8xIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJfMUBleGFtcGxlLmNvbSIsImV4cCI6MTgwfSwiaWF0IjoxNzA0OTE3OTQyLCJleHAiOjE3MDQ5MTgxMjJ9.kXsgZemdro3ZVmeA6Rd2N9fxC4PTOPyHrWrOKyIqhso'



refresh-token test case:
1. check till have validity storing into db
2. check when invalid but stored in db
3. check when it is not existed in db

*/