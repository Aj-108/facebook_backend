import { Router, Request, Response } from "express";
import multer from 'multer' ;
import { imageUpload } from "../Controllers/ImageController";

const router = Router() ;

const storage = multer.memoryStorage() ;
const upload = multer({storage}) ;

router.post('/upload',upload.single('myimage'),imageUpload)

export default router;
