import express from 'express'
import { loginUser,signUPUser,showUser,deleteUPUser,showUserById } from '../controller'
import{signupValidation,accessTokenVerify} from '../validation/'

const router = express.Router()
router.post('/', signupValidation,signUPUser)
router.post('/login',signupValidation,loginUser)
router.get('/', showUser)
router.delete('/:id',accessTokenVerify, deleteUPUser)
router.get('/single', accessTokenVerify,showUserById)
export = router