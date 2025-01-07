import dotenv from "dotenv"
import { app } from './app.js'; // Ensure the file exists and the extension is correct.
import connectDB from "./db/index.js";


dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 8001 // IF THE PORT IS COMING FROM ENV THEN IT WILL BE 8000
// ELSE it will be then 8001

connectDB()
.then(() =>{
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    
    })
})
.catch((err) => {
    console.log("mongo db connection error ", err);
    
})
