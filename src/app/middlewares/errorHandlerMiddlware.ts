import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import config from '../config';
import { developmentError } from '../errors/developmentError';
import { productionError } from '../errors/productionError';
import { ZodError } from 'zod';
import { handlezodError } from '../errors/All Errors/handleZodError';
import { handleDuplicateError } from '../errors/All Errors/handleDuplicateError';
import { handleCastError } from '../errors/All Errors/handleCastError';
import { handleValidationError } from '../errors/All Errors/handleValidationError';
import CustomError from '../errors/CustomError';
import BaseError from '../errors/BaseError';
import { handleRefreshTokenError } from '../errors/All Errors/handleRefreshTokenError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorMessages: string | undefined;
  const isZodError: boolean = err?.customErrors instanceof ZodError;
  const isDuplicate: boolean = Number(err?.code) === 11000 ? true : false;
  const isCastError: boolean = err?.name === 'CastError' || err?.name === 'BSONError' ? true : false;
  const isValidatorError: boolean = err?.name === 'ValidationError' ? true : false;
  const isCustomError: boolean = err instanceof BaseError ? true : false;
  const isRefreshTokenError: boolean = (err?.customErrors?.errorTag === 'RefreshTokenError') ? true : false;

  // console.log('---> globalErrorHandler: ', err.message)

  if (isZodError) {
    const results = handlezodError(err?.customErrors);
    errorMessages = results?.errorMessage;
    err.customErrors = results?.errorDetails;
  } else if (isDuplicate) {
    const results = handleDuplicateError(err);
    errorMessages = results?.errorMessage;
    err.customErrors = results?.errorDetails;
  } else if (isCastError) {
    const results = handleCastError(err);
    errorMessages = results?.errorMessage;
    err.customErrors = results?.errorDetails;
  } else if (isValidatorError) {
    const results = handleValidationError(err);
    errorMessages = results?.errorMessage;
    err.customErrors = results?.errorDetails;
  } else if(isRefreshTokenError){
    const results = handleRefreshTokenError(err)
    errorMessages = results?.errorMessage;
    err.customErrors = results?.errorDetails;
  } else if (isCustomError) {
    errorMessages = err?.message;
  } else if (err instanceof Error) {
    errorMessages = err?.message;
  } else {
    return;
  }


  // Set up environment for error handling
  if (config.NODE_ENV === 'development') {
    developmentError(err, res, errorMessages);
  } else {
    productionError(err, res, errorMessages);
  }
};

export default globalErrorHandler;


/*
RangeError 
MongoNetworkTimeoutError

*/
