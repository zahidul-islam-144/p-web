import jwt from 'jsonwebtoken';
import { IUser } from '../modules/user/user.interface';
import { jwtServices } from './jwtServices';
import config from '../config';
import { authUtils } from '../modules/auth/auth.utils';

const createToken = (user: IUser, mode: string) => {
  switch (mode) {
    case 'ACCESS_TOKEN':
      const accessTokenExpiration = authUtils.accessTokenExpiration();
      const jwtPayload = authUtils.handleJWTPaylod(user, accessTokenExpiration);
      const accessTokenSecret = config.JWT_SECRET_FOR_ACCESS_TOKEN as string;
      const derivedAccessToken = jwtServices.createJWTToken(
        jwtPayload,
        accessTokenSecret,
      );
      return derivedAccessToken;
      break;

    case 'REFRESH_TOKEN':
      const refreshTokenExpiration = authUtils.refreshTokenExpiration();
      const jwtPayload2 = authUtils.handleJWTPaylod(
        user,
        refreshTokenExpiration,
      );
      const refreshTokenSecret = config.JWT_SECRET_FOR_REFRESH_TOKEN as string;
      const derivedRefreshToken = jwtServices.createJWTToken(
        jwtPayload2,
        refreshTokenSecret,
      );
      return derivedRefreshToken;
      break;
    default:
      break;
  }
};

export default createToken;
