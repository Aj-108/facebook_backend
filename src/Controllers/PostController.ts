import {Request,Response} from 'express'
import {pool} from '../db'


export const create = async (req:Request,res:Response) => {
    try{
        const {content,content_image} = req.body ;
        const userId = req.userId ;
        const client = await pool.connect() ;
        const upload = await client.query(`INSERT INTO posts (user_id, content, content_image) VALUES ($1, $2, $3)`,
        [userId,content,content_image]);

        client.release() ;
        res.status(200).json({ok:true,message:"Post Created Successfully"})
    }
    catch(err){
        console.log("error",err) ;
        res.status(500).json({ok:false,error:"Internal Server Error",err})
    }
}

export const getPost = async (req:Request,res:Response) => {
    try{
        const client = await pool.connect() ;
        const data:any = await client.query(
            `Select * from posts where post_id = $1`,
            [req.params.postid]
        )

        res.status(201).json({ok:true,data:data.rows[0]}) ;
    }
    catch(err){
        console.log(err) ;
        res.status(500).json({ok:false,error:"Internal Server Error",err})
    }
}
