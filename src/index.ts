import express from "express"
import { pool, createTable } from './db' ;
import cors from 'cors' ;
import bodyParser from 'body-parser' ;
import cookieparser from 'cookie-parser'
import userRoutes from './Routes/UserRoutes'
import postRoutes from './Routes/PostRoutes'
import imageRoutes from './Routes/ImageRoutes'
import dotenv from 'dotenv'

const app = express() ;
const PORT = 8000 ;

require('dotenv').config() ;

declare global{
  namespace Express{
    interface Request{
      userId? : string
    }
  }
}

app.use(cors()) ;
app.use(cookieparser()) ;   
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

app.use('/api/auth',userRoutes) ;
app.use('/api/post',postRoutes) ;
app.use('/api/image',imageRoutes) ;


createTable().then(()=>console.log("Table created")) ;

app.listen(PORT,()=>{
    console.log("server is running on PORT :",PORT)
})