import { ZodError } from 'zod';
import { EHttpStatusCode } from '../interface/interface';
import BaseError from './BaseError';

export const developmentError = (_err: any, _res: any, errMessages: string = '') => {
  let statusCode: number = Number(
    _err?.statusCode || EHttpStatusCode.INTERNAL_SERVER_ERROR,
  );
  let message: string = _err?.message || 'Something went wrong.';
  let errorMessages: string = errMessages;
  let errorDetails: Record<string, any> = _err?.customErrors || [];

  console.log("\n\n<------ begin ------>");
  //---->
  
  console.log('---> _err: ', _err)

  //--->
  console.log("<------ end ------>\n\n");

  _res
    .status(statusCode)
    .json({
      success: false,
      // status: _err?.status || 'Error',
      message: message,
      errorMessages: errorMessages,
      errorDetails: errorDetails,
      stack: _err.stack,
    })
    .end();
};
