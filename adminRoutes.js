import express from 'express'
import jwt from 'jsonwebtoken'

import crypto,{ randomUUID } from "crypto";
import { error } from 'console';
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

route.post("/credit",verifyToken,(req,res)=>{
    try {

        const {user_ID,score}=req.body
        req.mysql.query("insert into credit(user_ID,score) values(?,?)",[user_ID,score],(err,results)=>{

            if(err){
                console.log(err)
                return res.status(500).json({error:"Failed",success:false})

            }

            req.mysql.query("select firstName , lastName from useraccount where User_ID=?",[user_ID],(err,results)=>{
                if(err){
                   

                    return res.status(500).json({error:"Failed",success:false})
                }
                let username=` ${results[0].firstName} ${results[0].lastName}`
                
                 res.json({message:`Credit score of ${score} awarded to ${username}`,success:true})
                })

        })

    } catch (error) {
        
    }
})


export default route