import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
//configure cloudinary 

 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET// 
});

const uploadCloudinary = async (locakFilePath)=>{
    try {
        if(!locakFilePath) return null
        const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type : "auto"
            }
        )
        console.log("File uploaded on cloudinary.File src: "+response.url)
        // once the file is uploaded , we would like to delete it from our server
        fs.unlink(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(locakFilePath)
        return null
    }
}