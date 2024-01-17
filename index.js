import bodyParser from "body-parser";
import express from "express";
import pool from "./dbConfig.js";
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from "./userRoutes.js";
import appRoutes from "./appRoutes.js";
import adminRoutes from './adminRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import chatRoutes from './chatRoutes.js'
import axios from "axios";
import http from 'http'
dotenv.config()

const app=express();
app.use(cors())

// parse json and form-data
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))

const getAccessToken=()=>{
    let consumerKey = 'ojKAdE26Ru63g13qKzWTtOpbXcFEdFh3'; 
	let consumerSecret = '2O8k1AM3CcrkgvIq'; 
    let url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth=new Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
   console.log(auth)

    let headers={"Authorization": "Basic " + auth,
    "Content-Type":"application/json; charset=utf8"}
    axios.get(url,{headers:headers}).then(response=>{
        console.log(response.json())
    }).catch(error=>{
        console.log(error)
    })
}
// get database connection

app.use((req,res,next)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            return res.status(500).send("Internal server error")
        }
        req.mysql=connection

        next()
    })
})

app.use("/user",userRoutes)
app.use("/app",appRoutes)
app.use("/admin",adminRoutes)
app.use("/vi",paymentRoutes)
app.use("",chatRoutes)





const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})
