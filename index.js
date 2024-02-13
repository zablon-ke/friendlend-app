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
import MpesaRoutes from './Mpesa.js'
import MpRoutes from './mp.js'  
import transRoutes from './transRoutes.js'  
dotenv.config()

const app=express();

// allow cors origin
app.use(cors())

// parse json and form-data
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))


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
app.use("",MpesaRoutes)
app.use("/p",MpRoutes)
app.use("/tr",transRoutes)

app.get("/used",(req,res)=>{
    res.json({"Message":"Out"})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})