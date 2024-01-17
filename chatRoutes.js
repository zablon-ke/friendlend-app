import express from 'express'
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

const route=express.Router()
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
route.post("/chat",verifyToken,(req,res)=>{
    try {
        let message_ID=randomUUID().split("-")[randomUUID().split("-").length-1].toUpperCase()
        const {receiver_ID,subject,content,state,sender_ID}=req.body

        let isnull=false
        Object.values(req.body).forEach(value=>{
            if(value ==null || value ==""){
                isnull=true
                return res.status(400).json({error:"Fill all fields",success:false})
            }
        })
        if(isnull){
            return
        }
        req.mysql.query("insert into messages(message_ID,receiver_ID,subject,content,state,sender_ID) values(?,?,?,?,?,?)",[message_ID,receiver_ID,subject,content,state,sender_ID],(err,results)=>{
            if(err){
               return res.status(500).json({error:"Internal Server error",success:false})
            }
            res.json({message:"Message Send",success:true})
        })
    } catch (error) {
        return res.status(500).json({error:"Internal Server error",success:false})
    }
})
export default route