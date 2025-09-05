import express from "express";
import cors from "cors"
import "dotenv/config"
import bodyParser from "body-parser";


let app = express()
app.use(cors())
app.use(bodyParser.json())


// Routes 
import db from "./config/db.js"
import prefsRoutes from "./Routes/prefs.routes.js"

db()
// Apis

app.get("/",(req,res)=>{
    res.json("ok run ")
})
app.use("/api/prefs", prefsRoutes);


//listing
app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on ${process.env.PORT}`);
})