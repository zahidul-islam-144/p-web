import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { IUser } from '../user/user.interface';
import { TJwtPayload } from '../../interface/interface';
import { TCookieOption } from './auth.interface';

const accessTokenExpiration = (): number => {
  const expirationInMinutes: number =
    parseInt(config.ACCESS_TOKEN_EXPIRY!, 10) || +60; //default accessToken will valid: 1 hour.
  const expirationInSeconds: number = expirationInMinutes * 60;
  return expirationInSeconds;
};

const refreshTokenExpiration = (): number => {
  // const expirationInMinutes =
  //   parseInt(config.REFRESH_TOKEN_EXPIRY!, 10) * 24 * 60; // day to minutes
  const expirationInMinutes =
  parseInt(config.REFRESH_TOKEN_EXPIRY!, 10) ;
  const expirationInSeconds = expirationInMinutes * 60;
  return expirationInSeconds;
};

const handleJWTPaylod = (userData: IUser, expiry: number): TJwtPayload => {
  const jwtPayload = {
    _id: userData?._id,
    username: userData?.username,
    role: userData?.role,
    email: userData?.email,
    exp: expiry,
  };
  return jwtPayload;
};


const cookieOptions : TCookieOption = {
  expires: new Date(
    Date.now()/1000 + parseInt(config.COOKIE_EXPIRY!, 10) * 60
  ),
  httpOnly: true,
  secure: true,
  sameSite: true,
}

const cookieOptionsToReset : TCookieOption = {
  httpOnly: true,
  // secure: config.NODE_ENV === 'production',
  secure: true,
  sameSite: true,
}

export const authUtils = {
  accessTokenExpiration,
  refreshTokenExpiration,
  handleJWTPaylod,
  cookieOptions,
  cookieOptionsToReset
};

/*
  // const issuedAt = Math.floor(Date.now() / 1000); // get current time in seconds

  // const expirationInSeconds: number = issuedAt + expirationInMinutes * 60;

*/
