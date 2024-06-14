import { EHttpStatusCode } from '../interface/interface';

// handles productional error
export const productionError = (
  _err: any,
  _res: any,
  errMessages: string = '',
) => {
  let statusCode: number = Number(_err?.statusCode);
  let message: string = _err?.message;
  let errorMessages: string = errMessages;

  if (_err?.isOperational) {
    _res
      .status(_err?.statusCode)
      .json({
        success: false,
        status: _err?.status || 'Error',
        message: _err?.message,
        errorMessages: errorMessages,
      })
      .end();
  } else {
    _res
      .status(Number(EHttpStatusCode.INTERNAL_SERVER_ERROR))
      .json({
        success: false,
        status: 'Error',
        message: 'Something went wrong.',
      })
      .end();
  }
};
