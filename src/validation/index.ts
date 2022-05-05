import jwt from 'jsonwebtoken'
import Joi from 'joi'
import {access} from '../config/'
import ApiError from '../config/apierror'
import {Request,NextFunction} from 'express'
import client from '../config/db.connect';


export const signupValidation = (req:Request,_:any,next:NextFunction) => {
    const loginUser = (user:any) => {
      const JoiSchema = Joi.object({
        email: Joi.string().email().max(50).required(),
        password: Joi.string().min(5).max(30).required(),
      });
      return JoiSchema.validate(user);
    };
    const response:any = loginUser(req.body);
    const error:any = response.error
    if (error) {
      const msg = error.details[0].message.replace(/[^a-zA-Z0-9]/g, ' ');
      return next(new ApiError(400, msg));
    } else {
      next();
    }
};

export const taskValidation = (req:Request, _:any,next:NextFunction) => {
  const task = (user:any) => {
    const JoiSchema = Joi.object({
      title: Joi.string().min(3).max(50).required(),
      description: Joi.string().min(5).max(200).required(),
    });
    return JoiSchema.validate(user);
  };
  const response:any = task(req.body);
  const error:any = response.error
  if (error) {
    const msg = response.error.details[0].message.replace(/[^a-zA-Z0-9]/g, ' ');
    return next(new ApiError(400, msg));
  } else {
    next();
  }
};

export const accessTokenVerify = (req:any, _:any,next:NextFunction) => {
    const chickToken = (req:any) => {
      if (req.query.token) {
        return req.query.token;
      } else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.split(' ');
        return bearerToken[1];
      } else {
        return false;
      }
    };
    const token = chickToken(req);
    if (token === false) {
        return next(new ApiError(400, 'A token is required for authentication'));
    } else {
      jwt.verify(token, access, async (error:any, payload:any) => {
        if (error) {
          return next(new ApiError(400, 'invalid token'));
        } else {
          const userId:string = payload.aud;
          const result = await client.query(`SELECT * FROM todo WHERE email = '${userId}'`);
          if (!result) {
            return next(new ApiError(400, 'no user found this token'));
          }
          req.userId =  userId;
          next();
        }
      });
    }
}

export const accessToken = async (getId:string) => {
  const userId = getId;
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: '24h',
      issuer: 'sourabh@gmail.com',
      audience: userId,
    };
    const payload = {};
    jwt.sign(payload, access, options, (err:any, token:any) => {
      if (err) {
        return reject({ message: 'Invalid operation!' });
      } else {
        resolve(token);
      }
    });
  });
}