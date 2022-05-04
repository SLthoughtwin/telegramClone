const { Client } = require("pg");
const client = require("../config/db.connect")
import {Request ,Response} from 'express'
export const signUPUser =  (req:Request, res:Response) => {
  try {
    console.log(req.body)
    return res.send('this is type script')
  } catch (error:any) {
    return res.status(200).json({
        message: error.message
    });
  }
};