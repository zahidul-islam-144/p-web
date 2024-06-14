import { IGenericErrorResponseType } from '../errors.interface';

export const handleRefreshTokenError = (_err: any): 
IGenericErrorResponseType => {
  return {
    errorMessage: _err?.message,
    errorDetails: { ..._err?.customErrors },
  };
};
