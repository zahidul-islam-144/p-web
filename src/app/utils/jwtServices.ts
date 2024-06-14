import jwt, { JwtPayload } from 'jsonwebtoken';
import { EHttpStatusCode, TJwtPayload } from '../interface/interface';
import config from '../config';
import CustomError from '../errors/CustomError';

const createJWTToken = (jwtPayload: TJwtPayload, secretKey: string) : string | undefined => {
  try {
    const derivedKey = jwt.sign(
      {
        jwtPayload,
      },
      secretKey,
      { expiresIn: jwtPayload.exp },
    );
    return derivedKey;
  } catch (error) {
    console.log('---> JWT Token Creation Error: ', error);
    return undefined;
  }
};

const verifyJWTToken = (token: string, secretKey: string) : JwtPayload | undefined => {
  try {
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (errors) {
    console.log('---> JWT Token Verification Error: ', errors);
   return undefined
  }
};

export const jwtServices = {
  createJWTToken,
  verifyJWTToken,
};
