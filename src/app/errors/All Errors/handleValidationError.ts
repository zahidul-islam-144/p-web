import mongoose from 'mongoose';
import { IGenericErrorResponseType } from '../errors.interface';

export const handleValidationError = (
  _err: mongoose.Error.ValidationError,
): IGenericErrorResponseType => {
  const errMsg =
    Object.values(_err.errors)?.length > 0
      ? 'Validation error occurs at your data.'
      : '';
  return {
    errorMessage: errMsg,
    errorDetails: { ..._err?.errors },
  };
};
