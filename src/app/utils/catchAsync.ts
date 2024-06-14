import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import CustomError from '../errors/CustomError';
import { EHttpStatusCode } from '../interface/interface';

export default (asyncFunction: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): any => {
    return Promise.resolve(asyncFunction(req, res, next)).catch((error) => {
      console.log('---> catchAsyc:error', error);
      next(error)
      // next(new CustomError(EHttpStatusCode.NOT_ACCEPTABLE, error.message, true, error));
    });
  };
// Promise.resolve(fn(req, res, next)).catch((err) => next(err));
