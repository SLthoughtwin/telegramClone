import ApiError from '../config/apierror'
import { Response,NextFunction} from 'express'
import client from '../config/db.connect';
import {responseHandler} from '../config/errorHandler'


export const createTask = async (req:any, res:Response,next:NextFunction) => {
  try {;
      const { title, description }:{ title:string, description:string } = req.body;
    const userId:string = req.userId
    const findTask = await client.query(
      `SELECT * FROM task WHERE title = '${title}' AND useremail = '${userId}'`
    );
    if (findTask.rows.length > 0) {
      return next(new ApiError(400, `this title already exist`));
    }
    const query = `INSERT INTO task (title,description,useremail)VALUES('${title}','${description}','${userId}')RETURNING *`;
    client
      .query(query)
      .then((result) => {
        return responseHandler(
          200,
          "create task successfully",
          res,
          result.rows
        );
      })
      .catch((error:any) => {
        return next(new ApiError(400, error.message));
      });
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};
export const showTask = async (req:any, res:Response,next:NextFunction) => {
  try {
    const userId:string = req.userId
    const query1 = ` SELECT task.useremail,task.title,task.description FROM task
      LEFT JOIN todo
      ON todo.email = task.useremail WHERE email = '${userId}'`;
    const result = await client.query(query1);
    if (!result) {
      return next(new ApiError(400, "task not found"));
    }
    return responseHandler(200, "task found successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};
export const updateTask = async (req:any, res:Response,next:NextFunction) => {
  try {
    const { title, description }:{ title:string, description:string } = req.body;
    let {id}:{id:any} = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `UPDATE task SET title = '${title}',description = '${description}' WHERE id = ${id}AND useremail = '${req.userId}'RETURNING *`;
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task update successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};
export const deleteTask = async (req:any, res:Response,next:NextFunction) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `DELETE FROM task WHERE id = ${id} AND useremail = '${req.userId}'RETURNING *`;
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task delete successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};
export const showTaskById = async (req:any, res:Response,next:NextFunction) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }
    const query = `SELECT * FROM task WHERE id= ${id} AND useremail = '${req.userId}'`;
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    return responseHandler(200, "task find successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};
export const completeTask = async (req:any, res:Response,next:NextFunction) => {
  try {
    let { id } = req.params;
    id = id.replace(/['"]+/g, "");
    id = parseInt(id);
    if (Number.isNaN(id) === true) {
      return next(new ApiError(400, "id type must be integer"));
    }

    const findTask = `SELECT * FROM task WHERE id=${id} AND useremail = '${req.userId}'`;
    const result1 = await client.query(findTask);
    if (result1.rows.length === 0) {
      return next(new ApiError(400, "invalid id"));
    }
    if (result1.rows[0].ischeck === true) {
      const query = `UPDATE task SET ischeck = '${false}' WHERE id = ${id} AND useremail = '${req.userId}' RETURNING *`;
      const result = await client.query(query);
      return responseHandler(200, "task update successfully", res, result.rows);
    }
    const query = `UPDATE task SET ischeck = '${true}' WHERE id = ${id} AND useremail = '${req.userId}' RETURNING *`;
    const result = await client.query(query);
    return responseHandler(200, "task update successfully", res, result.rows);
  } catch (error:any) {
    return next(new ApiError(400, error.message));
  }
};