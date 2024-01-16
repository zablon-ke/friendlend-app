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
        const {user_ID,loanAmount,purpose,type_ID}=req.body
        Object.values(req.body).forEach(value=>{
            if(value =="undefined" || value==""){
                return res.status(401).json({error:"Fill all inputs",success:false})
            }
        })
        let app_id=randomUUID().split("-")[randomUUID().split("-").length-1].toUpperCase()  
        req.mysql.query("select * from loan where user_ID=?",[user_ID],(err,results)=>{
            if(err){
                return res.json({message:"",success:false})
            }
            let loans=results[0]
            if(results.length >0){
                return  res.json({message:`already have a ${loans['State']} loan in the system`,success:false})
            }
            req.mysql.query("insert into loan(app_ID,user_ID,loanAmount,purpose,type_ID,State) values(?,?,?,?,?,?)",[app_id,user_ID,loanAmount,purpose,type_ID,"pending"],(err,result)=>{
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
}) 
route.post("/contract",verifyToken,(req,res)=>{
    try{
        let contract_ID="CT"+randomUUID().split("-")[randomUUID().split("-").length-1].toUpperCase() 
        const {app_ID,borrower_ID,lender_ID}=req.body
        
        req.mysql.query("select * from Lender where user_ID=?",[req.user.user_id],(err,results)=>{
            if(err){
                return res.status(500).json({error:"Failed",success:false})
            }
            if(results.length < 1){
                 return res.json({message:"Only Lenders can lend , create a lender account to Lend",success:false})
            }
            req.mysql.query("select loanAmount, period,interestRate from loan inner join loan_type on loan.type_ID = loan_type.ID where app_ID=?",[app_ID],(err,results)=>{
                if(err){
                    return res.status(500).json({error:"Internal Server error ",success:false})
                }
                if(results.length > 0){
                    let loanAmount=results[0].loanAmount
                    let amount1=parseFloat(results[0].loanAmount)
                    let interest=parseFloat(results[0].interestRate) /100 * amount1
                    
                    console.log(interest)
                    let period=results[0].period
                  req.mysql.query("insert into contract(contract_ID,app_ID,borrower_ID,lender_ID,State,interestCharged,amount) values(?,?,?,?,?,?,?)",[contract_ID,app_ID,borrower_ID,lender_ID,"Not Completed",interest,amount1],(err,results)=>{
                    if(err){
                        console.log(err)
                        return res.status(500).json({message:"Internal Server error",success:false})
                    }
                    req.mysql.query("select firstName , lastName from useraccount where User_ID=?",[borrower_ID],(err,results)=>{
                        if(err){
                            return res.status(500).json({error:"Failed ",success:false})
                        }
                        let username=` ${results[0].firstName} ${results[0].lastName}`
                         res.json({message:`Loan amount of ${loanAmount} Approved to ${username} to be repaid after ${period} days`,success:true})
                })
                    })
                }
                else{
                    res.json({message:"Failed",success:false})
                }
            })
    })
    }
    catch(error){
        console.log(error)
    }
})
route.post("/type",verifyToken,(req,res)=>{
   try {
    const {period,interestRate}=req.body

    req.mysql.query("insert into loan_type(period,interestRate) values(?,?)",[period,interestRate],(err,results)=>{
        if(err){
            return res.status(500).json({error:"Internal Server error",success:false})
       }
        res.json({message:"Loan Type added successfully",success:true})
    })
   } catch (error) {
      return res.status(500).json({error:"Internal Server error",success:false})
   }
})

export default route