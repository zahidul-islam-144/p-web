import { Types } from "mongoose";

export type TSendResponse<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  meta?: object;
  data: T;
};


export enum EHttpStatusCode {
  OK = 200,
  SUCCESSFULL = 201,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export type TJwtPayload = {
  _id: Types.ObjectId | string;
  username: string;
  role: string;
  email: string;
  exp: number;
}
