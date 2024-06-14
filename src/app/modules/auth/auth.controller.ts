import catchAsync from '../../utils/catchAsync';
import customResponse from '../../utils/customResponse';
import { EHttpStatusCode } from '../../interface/interface';
import { authService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { authUtils } from './auth.utils';
import { TCookieOption } from './auth.interface';

const {
  logInUserIntoDB,
  changePasswordIntoDB,
  getRefreshTokenFromDB,
  logOutUserFromDB,
} = authService;

const loginUser = catchAsync(async (req, res, next) => {
  const { ...reqBody } = req.body;
  const { accessToken, refreshToken, ...restData } = await logInUserIntoDB(
    reqBody,
    req.cookies,
    res,
  );

  // Set refreshToken as a cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: config.NODE_ENV === 'production',
    secure: true,
    sameSite: true,
  });

  // Set accessToken as a header
  res.header('accessToken', accessToken!);

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: 'User log in successful.',
    data: restData || [],
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { ...reqBody } = req.body;
  const results = await changePasswordIntoDB(reqBody, req?.user as JwtPayload);

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: 'Password changed successfully.',
    data: results || null,
  });
});

const getRefreshToken = catchAsync(async (req, res, next) => {
  const cookies = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RQYXlsb2FkIjp7Il9pZCI6IjY2MDMwY2Y4Y2I0MDM2NDA0MGRkNDdiMiIsInVzZXJuYW1lIjoidXNlcl8xIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6InVzZXJfMUBleGFtcGxlLmNvbSIsImV4cCI6MzAwfSwiaWF0IjoxNzExNTYzNzE4LCJleHAiOjE3MTE1NjQwMTh9.1qviRSlOh3KNpor_BRl8urR56PSj3zH_Qb3OBdCSS6s`

  const results = await getRefreshTokenFromDB({refreshToken: cookies});
  console.log('---> results', results);
  const { newAccessToken, newRefreshToken } = results;

  res.cookie('refreshToken', newRefreshToken, authUtils.cookieOptions);

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: 'Access token retrieved successfully.',
    data: { accessToken: newAccessToken } || [],
  });
});

const logOutUser = catchAsync(async (req, res, next) => {
  const results = await logOutUserFromDB(req?.params?.id, req?.cookies, res);
  console.log('---> results', results);

  customResponse(res, {
    success: true,
    statusCode: EHttpStatusCode.SUCCESSFULL,
    message: 'Log out successfully.',
    data: null || [],
  });
});

export const authController = {
  loginUser,
  changePassword,
  getRefreshToken,
  logOutUser,
};
