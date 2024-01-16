import { Router, Request, Response } from "express";
import { login, register, userData } from "../Controllers/UserController";
import {checkAuth} from '../Middleware/checkAuthToken' 

const router = Router() ;

router.post('/register',register);
router.post('/login',login)
router.get('/userDetails/:userId',checkAuth,userData)

export default router;
