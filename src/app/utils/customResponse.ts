import { Response } from 'express';
import { TSendResponse } from '../interface/interface';

const customResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    meta: data.meta,
    data: data.data,
  }).end();
};

export default customResponse;
