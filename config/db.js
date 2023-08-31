import mongoose from "mongoose";
import config from "./index.js";

export default async () => {
    const db = mongoose.connection
    try {
        db.on('connected', () => {
            console.log(`DB connected successfully on ${db.host}`.green.underline);
        });

        db.on('disconnected', () => {
            console.log(`DB disconnected successfully on ${db.host}`.red.underline);
        });
        
        db.on('error', (err) => {
            console.log(`Error Occured ${err}`.red.underline)
        })

        return await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.log(`Error Occured ${err}`.red.underline)
    }
}