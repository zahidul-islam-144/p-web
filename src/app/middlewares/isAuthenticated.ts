import { JwtPayload } from 'jsonwebtoken';
import CustomError from '../errors/CustomError';
import catchAsync from '../utils/catchAsync';
import { EHttpStatusCode } from '../interface/interface';
import { jwtServices } from '../utils/jwtServices';
import { Request } from 'express';
import { User } from '../modules/user/user.model';
import config from '../config';

const isAuthenticated = catchAsync(async (req, res, next) => {
  const accessToken = req.headers['authorization'];

  if (!accessToken) {
    throw new CustomError(
      EHttpStatusCode.UNAUTHENTICATED,
      "Your aren't authorized to this site. Please, login at first.",
      true,
      [],
    );
  } else {
    const accessTokenSecret = config.JWT_SECRET_FOR_ACCESS_TOKEN as string;
    const decodedJWT = jwtServices.verifyJWTToken(accessToken, accessTokenSecret);
    console.log('---> decodedJWT', decodedJWT);
    
    if (decodedJWT) {
      const { jwtPayload, iat } = decodedJWT as JwtPayload;
      const { username } = jwtPayload;
      const foundUser = await User.isUserExist(username);

      if (foundUser) {
        req.user = jwtPayload; // set user in express Request object globally.
        next();
      } else {
        throw new CustomError(
          EHttpStatusCode.FORBIDDEN,
          'Forbidden access to this site. User is not registered yet.',
          true,
          [],
        );
      }

      if (
        foundUser.passwordManager?.activePassword?.lastUpdatedAt &&
        User.isJWTIssuedBeforePasswordChanged(
          foundUser.passwordManager?.activePassword?.lastUpdatedAt,
          iat as number,
        )
      ) {
        throw new CustomError(
          EHttpStatusCode.UNAUTHENTICATED,
          'UNAUTHENTICATED access...',
          true,
          [],
        );
      }
    } else {
      throw new CustomError(
        EHttpStatusCode.UNAUTHENTICATED,
        'Please, login at first. Make sure, your credential is correct.',
        true,
        [],
      );
    }
  }
});

export default isAuthenticated;
