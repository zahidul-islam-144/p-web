import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponseType } from '../errors.interface';

export const handleDuplicateError = (_err: any): 
IGenericErrorResponseType => {

  const errMesg: string = _err?.message.match(/"([^"]*)"/)[1];

  return {
    errorMessage: `${errMesg} already exists.`,
    errorDetails: { ..._err },
  };
};
