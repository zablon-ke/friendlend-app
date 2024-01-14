import bodyParser from "body-parser";
import mysql from "mysql2"
import express from "express";
import pool from "./dbConfig.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from "./userRoutes.js";
import appRoutes from "./appRoutes.js";
dotenv.config()

const app=express();
app.use(cors())

// parse json and form-data
app.use(express.json())
app.use(express.urlencoded({extended : true}))


const getAccessToken=(key)=>{

}
// get database connection
const key=btoa(`FTWn9sSpCGGfelG3uqqBH2UEAt6yND9L:G7HBZj0vALmWZ6Ml`)
        
        getAccessToken(key)
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
app.get("/",(req,res)=>{
    req.mysql.query("SELECT * from UserAccount",(err,results)=>{
        if(err){
           return res.status(500).send("Internal server error")
        }
        res.json(results)
    })
})

const verifyToken=(req,res,next)=>{
    const secret=process.env.SECRET || crypto.randomBytes(32).toString("hex")
   
   const token=req.headers.authorization.split(" ")[1]
  
   jwt.verify(token,secret,(err,decoded)=>{
    if(err){
      return  res.status(401).json({"success":false,"message":"session expired"})
    }
    req.user=decoded
    next()
   })
}

app.post("/user/add/personal",verifyToken,(req,res)=>{
    try{
        var token=req.headers.authorization.split(" ")[1]
        if(token ==""){
            return res.status(401).json({"message":"Authorization failed "})
        }
        var user_id=req.user.user_id
        
        var {id,firstName,surName,gender,middleName,mobile,dob}=req.body
        var othernames=`${middleName} ${firstName}`
        req.mysql.query("select phone from userAccount where user_id=?",[user_id],(err,results)=>{
            if(err){
                return res.status(500).json*({message:"Failed to fetch info",success:false})
            }
            let status="1"
            req.mysql.query("insert into borrower_info(ID,Surname,OtherNames,phone,Gender,DOB,acc_id,status) values(?,?,?,?,?,?,?,?) ",[id,surName,othernames,mobile,gender,dob,user_id,status],(err,results)=>{
                if(err){
                    if(err['sqlMessage'].includes("Duplicate entry")){
                        return res.status(200).json({message:"Account already exists",success:false})
                
                    }
                    return res.status(500).json({message:"Failed update profile info",success:false})
                
                }
                    res.json({message:"Profile updated successfully",success:true})
            })
        })
    }
    catch(error){
    }
})

app.post("/user/add/loan",(req,res)=>{
    try{

    }
    catch(err){

    }
})

app.post("/user/add/emergency",verifyToken,(req,res)=>{
    try{
        var token=req.headers.authorization.split(" ")[1]
        if(token ==""){
            return res.status(401).json({"message":"Authorization failed "})
        }
        var user_id=req.user.user_id

        const {br_id,fullName,relation,mobile}=req.body

        req.mysql.query("insert into emergency(fullName,phone,relationshp,b_id) values(?,?,?,?)",[fullName,mobile,relation,br_id],(err,results)=>{

            if(err){
                console.log(err)
                return res.status(500).json({"message":"Server error , failed to save details",success:false})
                
            }
            
            res.json({message:"Emergency contact Saved",success:true})
        })
    }
    catch(error){

        console.log(error)
    }

})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})



