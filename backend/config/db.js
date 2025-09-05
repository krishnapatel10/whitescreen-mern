import mongoose from "mongoose";
import "dotenv/config"

export default function db(){
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("connected to mongodb...");
    }).catch(err =>{
        console.log({message:err.message});
    })
}