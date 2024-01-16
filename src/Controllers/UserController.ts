import {Request,Response} from 'express'
import {pool} from '../db'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

require('dotenv').config({ path: __dirname+'/.env' });

export const register = async(req:Request,res:Response) => {
    try{
        const {username,password,email,fname,lname} = req.body ;

        const client = await pool.connect() ;
        const existingUser = await client.query(
            'SELECT * FROM users WHERE username=$1 OR email=$2',
            [username,email]
        )
        
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ok:false, error: 'User with the same username or email already exists' });
          }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt) ;

        const result  = await client.query(
            'INSERT INTO users(username, email, password,fname,lname) VALUES($1, $2, $3,$4 ,$5) RETURNING *',
            [username, email, hashedPassword,fname,lname]
        );
        client.release() ;
        return res.status(201).json({ok:true,message:"User registered successfully"})
    }
    catch(err:any){
        res.status(500).json({ ok:false,error: err.message });
    }
}

export const login = async(req:Request,res:Response) =>{
    try{
        const {email,password} = req.body ;

        const client = await pool.connect() ;
        const result = await client.query(
            'SELECT * FROM users where email = $1',
            [email||" "]
        );
        // console.log(result)

        if(result.rows.length === 0  ) {
            res.status(409).json({ok:false,message:"Invalid Credentials"})
        }

        const user = result.rows[0] ;

        // console.log("password",user.password)
        const passwordMatch = await bcrypt.compare(password,user.password); 

        if(!passwordMatch){
            return res.status(409).json({ok:false,message:"Invalid Credentials"})
        }

        const authToken = jwt.sign({userId : user.user_id},process.env.JWT_SECRET_KEY!,{expiresIn : '30m'}) ;
        const refreshToken = jwt.sign({userId : user.user_id},process.env.JWT_REFRESH_SECRET_KEY!,{expiresIn : '2h'}) ;

        res.cookie('authToken',authToken,({httpOnly : true})) ;
        res.cookie('refreshToken',refreshToken,({httpOnly:true})) ;

        res.status(201).json({ok:true,message:"Login Successful"})



    }
    catch(err){
        res.status(500).json({ ok:false,error: "Interval servor Error" });
    }
}

export const userData=  async(req:Request,res:Response)=>{
    try{
        // console.log("ID",req.userId)
        if(req.userId?.toString() !== req.params.userId?.toString()){
            return res.status(409).json({ ok:false,error: "Cannot acess data of other user" });    
        }

        

        const client = await pool.connect() ;
        const data:any = await client.query(
            `Select * from users where user_id = $1`,
            [req.userId]
        )

            res.status(201).json({data:data.rows[0]}) ;

    }
    catch(err){
        res.status(500).json({ ok:false,error: "Interval servor Error" });
    }
}