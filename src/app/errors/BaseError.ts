import config from "../config";

class BaseError<T = any> extends Error {
  public statusCode: number;
  public customErrors?: T | T[];
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean, customErrors?: T | T[]) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.customErrors = customErrors; // Assigning custom errors to customErrors

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    } else {
      this.stack = new Error().stack;
    }

    if (config.NODE_ENV === 'production') {
      this.stack = '';
    }
  }
}

export default BaseError;
