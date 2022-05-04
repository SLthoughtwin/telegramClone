import express from 'express'
import {signUPUser} from '../controller/index'
let router = express.Router()


router.post('/', signUPUser)
export = router