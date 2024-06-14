import BaseError from './BaseError';

class CustomError<T = any>  extends BaseError {
  constructor(statusCode: number, message: string, isOperational: boolean, customErrors: T | T[]) {
    super(statusCode, message, isOperational, customErrors);
  }
}

export default CustomError;
