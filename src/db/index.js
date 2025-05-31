import mongoose from "mongoose";
import dotenv from 'dotenv'
import { DB_NAME } from "../constants.js";
dotenv.config()

async function connectDb() {
    try {
        const Connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`DB is connected !! HOST ${Connection.connection.host}`);
    } catch (error) {
        console.log("Failed to connect ", error);
        process.exit(1)

    }
}

export default connectDb;