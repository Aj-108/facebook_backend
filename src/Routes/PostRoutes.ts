import { Router, Request, Response } from "express";
import {checkAuth} from '../Middleware/checkAuthToken' 
import { create, getPost } from "../Controllers/PostController";

const router = Router() ;

router.post('/create',checkAuth,create)
router.get('/getpost/:postid',checkAuth,getPost)
export default router;
