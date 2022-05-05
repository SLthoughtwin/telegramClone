import express from 'express'
import { createTask,deleteTask,showTaskById ,updateTask,completeTask,showTask} from '../controller'
import{taskValidation,accessTokenVerify} from '../validation/'
const router = express.Router()

router.post("/", accessTokenVerify, taskValidation,createTask);
router.delete("/:id", accessTokenVerify, deleteTask);
router.get("/:id", accessTokenVerify, showTaskById);
router.put("/:id", accessTokenVerify, taskValidation,updateTask);
router.get("/checked/:id",accessTokenVerify,completeTask);
router.get("/", accessTokenVerify, showTask);

export = router
