import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponseType } from '../errors.interface';

export const handlezodError = (_err: ZodError): 
IGenericErrorResponseType => {

  const errMesg: string = _err?.issues?.map((issue:ZodIssue) => issue?.message).join();

  return {
    errorMessage: errMesg,
    errorDetails: { ..._err },
  };
};
