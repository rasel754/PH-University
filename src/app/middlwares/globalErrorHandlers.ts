/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {  NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import handleZodError from '../errors/handleZotError';
import { TErrorSources } from '../interface/error';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/appError';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode =  500;
  let message =  'someting want wrong ';

  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'someting want wrong',
    },
  ];



  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  else if(err?.name === 'ValidationError'){
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  }
  else if (err instanceof AppError) {
    
    statusCode = err?.statusCode,
    message = err?.message,
    errorSource =[{
      path: '',
      message: err?.message,
    }]
  }
  else if (err instanceof Error) {
    
    
    message = err?.message,
    errorSource =[{
      path: '',
      message: err?.message,
    }]
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: config.NODE_ENV=='development'? err?.stack:null,
    // error: err,
  });
};

export default globalErrorHandler;
