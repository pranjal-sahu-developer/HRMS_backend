import User from "./models/userModel.js";
import bcrypt from "bcrypt";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
dotenv.config();

const userRegister = async () =>{
    connectDB();
    try {
        const hashPassword = await bcrypt.hash("sahu86",10)
        const newUser = new User({
            name:"Admin1",
            email:"pranjal17@gmail.com",
            password: hashPassword ,
            role:"admin"
        })
        await newUser.save();
        console.log("Admin created successfully")
    } catch (error) {
        console.log(error);
    }
}

userRegister();
