import express from "express";
import jwt from "jsonwebtoken";
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
const updateBalance=(req,transaction_type,user_ID,amount,borrower_ID=null)=>{

    if(transaction_type =="Deposit"){
        req.mysql.query("update Lender set amount = amount + ? where user_ID=?",[amount,user_ID],(err,results)=>{
          if(err){
            return res.status(500).json({message:"Failed ",success:false})
          }
          res.json({message:"success",success:true})
        })
    }
    else if(transaction_type =="credited"){
        req.mysql.query("update Lender set amount = amount - ? where user_ID=?",[amount,user_ID],(err,results)=>{
            if(err){
              return res.status(500).json({message:"Failed ",success:false})
            }
            res.json({message:"success",success:true})

          })
    }
}
route.post("/transaction",(req,res)=>{
    try {

       const {trans_ID, user_ID,amount,transaction_type,Description }=req.body

       req.mysql.query("select * from useraccount inner join Lender on Lender.User_ID = useraccount.user_ID where Lender.user_ID=?",[user_ID],(err,results)=>{
        if(err){   
            console.log(err)
            return res.status(500).json({"error":"Failed "})
        }

        if(results.length > 0){
            req.mysql.query("insert into transactions(trans_ID, user_ID,amount,transaction_type,Description) values(?,?,?,?,?)",[trans_ID, user_ID,amount,transaction_type,Description],(err)=>{
                 if(err){
                    console.log(err)
                    return res.status(500).json({error:"failed ",success:false})
                 }
                 res.json({message:"Transaction recorded successfully",success:true})
            })
            
        }
        else{
            res.status(400).json({message:"Provide valid inputs ",success:false})
        }
        
       })
        
    } catch (error) {
        
    }
})

export default route