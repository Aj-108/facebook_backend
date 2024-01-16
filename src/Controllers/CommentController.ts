import {Request,Response} from 'express'
import {pool} from '../db'


export const post = async (req:Request,res:Response) => {
    try{
       
    }
    catch(err){
        console.log("error",err) ;
        res.status(500).json({ok:false,error:"Internal Server Error",err})
    }
}
