
import { DB_NAME } from "../constants.js"
import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n mongodb connected ! DBhost: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error ",error);
        process.exit(1)
        
    }
}
export default connectDB