
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessAndFerfeshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        // Check if user exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); 

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}
const registerUSer = asyncHandler( async (req, res) => {
    const {fullname , email, username, password} = req.body
 
    if(
        [fullname, username, email , password ].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, " all fields are required ")
    }

    const existedUser = await User.findOne({
        $or : [{username} ,{email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")

    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path
    if(!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing")
    }
   

    
    let avatar ;
    try{
        avatar = await uploadCloudinary(avatarLocalPath)
        console.log("upload avatar" , avatar)
    } catch (error) {
        console.log("Error uploading avatar",error)
        throw new ApiError(500, "Failed to upload avatar")

    }

    let coverImage ;
    try{
        coverImage = await uploadCloudinary(coverLocalPath)
        console.log("upload avatar" ,coverImage)
    } catch (error) {
        console.log("Error uploading coverImage",error)
        throw new ApiError(500, "Failed to upload coverImage")

    }

    const user  = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
  const createdUser  = await User.findById(user._id).select(
    "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering a user")
    }
    
    try {
        return res
            .status(201)
            .json(new ApiResponse(200 , createdUser , "User registed sunccesfully"))
    } catch (error) {
        console.log("user creation failed");
        if(avatar){
            await deleteFromCloudinary(avatar.public_Id)

        }
        if(coverImage){
            await deleteFromCloudinary(coverImage.public_Id)
        }
        throw new ApiError(500 , "Something went wrong while registering a user and images were deleted")
    }
        
})

const  loginUser = asyncHandler ( async (req, res) => {
    //get a data from body
    const {email, username , password} = req.body

    // validation
    if(!email){
        throw new ApiError(400, "Email us required")
    }
    const user = await User.findOne({
        $or: [{username} , {email}]
    })
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // check or validate password
    const isPasswordValid = await user.isPasswordCorrect(password) 
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }
    const {accessToken , refreshToken} = await
    generateAccessAndFerfeshToken(user._id)

    const loggedInUser = await User.findById(user._id)
     .select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",

    }
    return res 
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken" , refreshToken , options)
      .json(new ApiResponse(
        200 , 
        {user: loggedInUser , accessToken , refreshToken},
        "user loggef in succesfully"
    ))
})
export {
    registerUSer,
    loginUser
}