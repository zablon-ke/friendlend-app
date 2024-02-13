import express from "express";
import jwt from 'jsonwebtoken'
import Logs from './logs.js'
import crypto,{ randomUUID } from "crypto";
const route=express.Router()

const verifyToken=(req,res,next)=>{
    const secret=process.env.SECRET || crypto.randomBytes(32).toString("hex")
   
   const auth=req.headers.authorization.split(" ")[0]
   const token=req.headers.authorization.split(" ")[1]
   if(auth !="Bearer"){
    return res.status(400).json({error:"invalid inputs",success:false})
   }
  
   jwt.verify(token,secret,(err,decoded)=>{
    if(err){
      return  res.status(400).json({"success":false,"message":"session expired"})
    }
    req.user=decoded
    next()
   })
}


route.get("vi/balance",verifyToken,(req,res)=>{
    req.mysql.query("select balance from useraccount where User_ID=?",[req.user.user_id],(err,results)=>{

        if(err){
            return res.status(500).json({error:"Internal server error",success:false})
        }

        res.json({message:"Record fetched",success:true,data:results[0]})
    })
})


export default route
