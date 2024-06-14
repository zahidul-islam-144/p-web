import express, { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { EHttpStatusCode } from '../interface/interface';
import CustomError from '../errors/CustomError';


export default (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqBody = req.body;
      const reqCookies = req.cookies;
      console.log('---> reqValidation:req.body::', reqCookies);
      await schema.parseAsync({
        body: reqBody,
        cookies: reqCookies,
      });

      next();
    } catch (errors) {
      next(
        new CustomError(
          EHttpStatusCode.NOT_ACCEPTABLE,
          'Validation error occured.',
          true,
          errors
        ),
      );
    }
  };
