// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"
// import dotenv from "dotenv"

// dotenv.config()
// //configure cloudinary 

//  cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key:  process.env.CLOUDINARY_API_KEY,
//     api_secret:  process.env.CLOUDINARY_API_SECRET// 
// });

// const uploadCloudinary = async (localFilePath)=>{
//     try {
//         if(!localFilePath) return null
//         const response = await cloudinary.uploader.upload(
//             localFilePath,{
//                 resource_type : "auto"
//             }
//         )
//         console.log("File uploaded on cloudinary.File src: "+response.url)
//         // once the file is uploaded , we would like to delete it from our server
//         fs.unlink(localFilePath)
//         return response
//     } catch (error) {
//         fs.unlinkSync(localFilePath)
//         return null
//     }
// }

// const deleteFromCloudinary = async (publicId) => {
//     try {
//         const result = await cloudinary.uploader.destroy(publicId)
//         console.log("Deleted from cloudinary . public id", publicId)
//     } catch (error){
//         console.log("error deleting from cloudinary" , error);
//         return null
        
//     }

// }

// export {uploadCloudinary , deleteFromCloudinary }
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        console.log("File uploaded on Cloudinary. File src: " + response.url);
        
        // Delete the local file
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            }
        });
        
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        
        // Attempt to delete the local file if upload fails
        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkError) {
            console.error("Error deleting local file after failed upload:", unlinkError);
        }
        
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary. Public ID:", publicId);
        return result;
    } catch (error) {
        console.log("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadCloudinary, deleteFromCloudinary };