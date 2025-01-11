import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            index:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true
        },
        fullname: {
            type: String,
            required: true,
            trim:true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true,"password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {timestamps: true}
)

userSchema.pre("save",async function (next){

    if(!this.modeified("password")) return next() // if we are not updating pssword

    this.password = bcrypt.hash(this.password,10) // 10 is the no of round in crytography

    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAcessToken = function() {
    // short lived acess token
    return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname
    } ,
    process.env.ACESS_TOKEN_SECRET,
    {expiresIn : process.env.ACESS_TOKEN_EXPIRY}

);
}


userSchema.methods.generateRefreshToken = function() {
    // short lived acess token
    return jwt.sign({
      _id: this._id,
      
    } ,
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    );
}
export const User = mongoose.model("User", userSchema)
