import dotenv from 'dotenv';
dotenv.config();
export const port = process.env.PORT;
export const pgUser = process.env.USER_NAME
export const pgHost = process.env.HOST_NAME
export const pgDB = process.env.DATABASE_NAME
export const pgPass = process.env.PG_PASSWORD
export const pgPort = process.env.PG_PORT
export const access:any = process.env.ACCESS_TOKEN
