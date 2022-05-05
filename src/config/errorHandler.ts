import { ErrorRequestHandler,Request,Response,NextFunction } from 'express';
import ApiError from './apierror'
export const errorHandler = (error:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.code).json({
      error: { statusCode: error.code, message: error.msg },
    });
  } else {
    return res.status(500).json({
      error: { statusCode: 500, message: 'oops! something went wrong' },
    });
  }
};

export const responseHandler = (status:number, msg:string, res:Response, data:any) => {
  if (data) {
    return res.status(status).json({
      data: { statusCode: status, message: msg, data },
    });
  }
  return res.status(status).json({
    data: { statusCode: status, message: msg },
  });
};