import mongoose from "mongoose";
import { IGenericErrorResponseType } from "../errors.interface";

export const handleCastError = (_err: mongoose.Error.CastError): IGenericErrorResponseType => {

    const errMesg = _err && _err?.message;

return {
    errorMessage: "Invalid ID provided.",
    errorDetails: { ..._err },
  };
}