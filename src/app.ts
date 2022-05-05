import express from 'express'
import {port} from './config/'
import dotenv from 'dotenv';
dotenv.config();
import {Request ,Response} from 'express'
import {errorHandler} from './config/errorHandler'
import Route from './route/'

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/v1/user',Route.userRouter)
app.use('/v1/task',Route.taskRoute)
app.use('*',(_:Request,res:Response)=>{
    return res.status(404).json({
        error:{
            statusCode:404,
            message: " route not found"
        }
    });
})
app.use(errorHandler)
app.listen(port, () => {
    console.log(`listening on port ${port}!`);
})