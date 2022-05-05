import {responseHandler} from '../config/errorHandler'
import ApiError from '../config/apierror'
import {Request ,Response,NextFunction} from 'express'
import client from '../config/db.connect';
import {accessToken} from '../validation/'


export const signUPUser =  async(req:Request, res:Response,next:NextFunction) => {
  try {
    const { password, email } = req.body;
    const email1 = email.trim()
    const password1 = password.trim()
    const findUser = await client.query(
      `SELECT * FROM todo where email = '${email1}'`
    );
    if (findUser.rows.length > 0) {
      return next(new ApiError(400, "email id already exist"));
    }
    const query = `INSERT INTO todo (password,email)VALUES('${password1}','${email1}')RETURNING *`;
    client
      .query(query)
      .then((result:any) => {
        return responseHandler(200, "signup successfully", res, result.rows);
      })
      .catch((error:any) => {
        console.log(error);
        return next(new ApiError(400, error.message));
      });
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};

export const loginUser = async (req:Request, res:Response,next:NextFunction) => {
  try {
    const { password, email } = req.body;
    const findUser = await client.query(
      `SELECT * FROM todo where email = '${email}'`
    );
    if (findUser.rows.length === 0) {
      return next(new ApiError(400, "invalid user"));
    }
    const emailDB = findUser.rows[0].email;
    const passwordDB = findUser.rows[0].password;
    if (password === passwordDB && email === emailDB) {
      const token = await accessToken(req.body.email);
      return responseHandler(200, "login successfully", res, token);
    }
    return next(new ApiError(400, "invalid login details"));
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};

export const showUser = async (_:any, res:Response,next:NextFunction) => {
  try {
    const result = await client.query("SELECT * FROM todo");
    return responseHandler(200, "user found successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};

export const deleteUPUser = async (req:any, res:Response,next:NextFunction) => {
  try {
    const userId:string = req.userId
    const result = await client.query(
      `delete FROM todo where email = '${userId}' RETURNING *`
    );
    if (result.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "user delete successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};

export const showUserById = async (req:any, res:Response,next:NextFunction) => {
  try {
    const userId:string = req.userId
    const result = await client.query(
      `select * FROM todo where email ='${userId}'`
    );
    if (result.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "user find successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};