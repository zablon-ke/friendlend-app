import express from "express";
import jwt from 'jsonwebtoken'
import crypto,{ randomUUID } from "crypto";
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


route.post("/loan",(req,res)=>{

    try{
        const {user_ID,loanAmount,purpose,term,interestRate}=req.body
        
        let app_id=randomUUID().split("-")[randomUUID().split("-").length-1].toUpperCase()  
        req.mysql.query("select * from loan where user_ID=?",[user_ID],(err,results)=>{
            if(err){
                return res.json({message:"",success:false})
            }
            let loans=results[0]
            if(results.length >0){
                return  res.json({message:`already have a ${loans['State']} loan in the system`,success:true})
           
            }
            req.mysql.query("insert into loan(app_ID,user_ID,loanAmount,purpose,term,interestRate,State) values(?,?,?,?,?,?,?)",[app_id,user_ID,loanAmount,purpose,term,interestRate,"pending"],(err,result)=>{
                if(err){
                    console.log(err)
                    return res.status(500).json({message:"Loan application failed, Internal server error",success:false})
                }
                res.json({message:"Loan application submitted successful",success:false})
            })
        })
    }
    catch(error){

        res.send(error)
    }

}
)


export default route