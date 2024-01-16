import {Request,Response} from 'express'
import sharp from 'sharp'
import cloudinary from 'cloudinary'

export const imageUpload = async (req:Request,res:Response) => {

    try{

        cloudinary.v2.config({ 
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.CLOUD_API_KEY, 
            api_secret: process.env.CLOUD_API_SECRET 
          });
        

        const file = req.file ;

        if(!file){
            return res.status(400).json({message : " No image file provided"})
        }

        sharp(file.buffer)
        .resize({width : 800})
        .toBuffer(async (err,data,info) => {
            if(err){
                console.log("Image processing error",err);
                return res.status(500).json({ok:false,error : "Error in image processing"}) ;
            }

            cloudinary.v2.uploader.upload_stream({resource_type : 'auto'},async (error:any,result:any) => {
                if(error){
                    console.error('Cloudianry Upload Error : ',error) ;
                    return res.status(500).json({ok:false,message : "Error in image uploading to Cloudinary"}) ;
                }

                res.status(200).json({ok:true,imageUrl : result.url,message:"Image uploaded successfully"}) ;

            }).end(data) ;
        })

    }
    catch(err){
        res.status(500).json({ok:false,message:"Internal servor error"})
    }

}