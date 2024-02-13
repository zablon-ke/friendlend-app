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

route.get("/duration",(req,res)=>{
    try {
        req.mysql.query("select period,interestRate,loan_limit from loan_type order by period DESC LIMIT 1",(err,results)=>{
            if(err){
                return res.status(500).json({"error":"Internal server error",success:false})
            }
            else if(results.length >0)
            {
                res.json({"message":"Data retrieved",success:true,data:results[0]})
            }
           else{
            res.status(422).json({"message":"No data received",success:false})
           }
        })
    } 
    catch (error) {
        res.status(422).json({"error":"Internal server error",success:false})
    }
    }
)

route.post("/loan",verifyToken,(req,res)=>{
    try{
        const {amount,purpose,type_ID}=req.body
        Object.values(req.body).forEach(value=>{
            if(value =="undefined" || value==""){
                return res.status(401).json({error:"Fill all inputs",success:false})
            }
        })
        let app_id=randomUUID().split("-")[randomUUID().split("-").length-1].toUpperCase()  
        req.mysql.query("select * from loan where user_ID=?",[req.user.user_id],(err,results)=>{
            if(err){
                return res.json({message:"",success:false})
            }
            let loans=results[0]
            if(results.length >0){
                return  res.status(422).json({error:`Already have a ${loans['State']} loan in the system`,success:false})
            }
            req.mysql.query("insert into loan(app_ID,user_ID,loanAmount,purpose,type_ID,State) values(?,?,?,?,?,?)",[app_id,req.user.user_id,amount,purpose,type_ID,"pending"],(err,result)=>{
                if(err){
                    console.log(err)
                    return res.status(500).json({error:"Loan application failed, Internal server error",success:false})
                }
                res.json({message:"Loan application submitted successful",success:false})
            })
        })
    }
    catch(error){
        res.status(500).json({error:"Internal server error",success:false})
    }
}) 
route.get("/vi/loan",verifyToken,(req,res)=>{
    try {
        req.mysql.query("select * from loan left join contract on contract.app_ID=loan.app_ID inner join loan_type on loan.type_ID=loan_type.ID where loan.user_ID=? order by Date_applied DESC",[req.user.user_id],(err,results)=>{
            if(err){
                return res.status(500).json({error:"Internal server error",success:false})
            }
            res.json({message:"Retrieved successfully",data:results})
        })
    } catch (error) {
        res.status(500).json({"error":"Failed",success:false})
    }
})
route.get("/loan/type",(req,res)=>{
    try {
        req.mysql.query("select * from loan_type;",(err,results)=>{
            if(err){
                return  res.status(500).json({error:`Internal server error`,success:false}) 
            }
            res.status(200).json({message:`Data Fetched `,success:false,data:results})
        })
    } catch (error) {
        return  res.status(500).json({error:`Internal server error`,success:false})
        
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
                    
                    let period=results[0].period
                    req.mysql.query("select * from contract where borrower_ID=? and state=?",[borrower_ID,"Not Completed"],(err,results)=>{
                        if(err){
                            return res.status(500).json({error:"Failed to fetch records",success:false})
                        }
                        if(results> 0){
                           return res.json({message:"Borrower already has a pending loan",success:false})
                        }
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
                                Logs(req,res,`Loan amount of ${loanAmount} Approved to ${username}`,"transactions")
                                 res.json({message:`Loan amount of ${loanAmount} Approved to ${username} to be repaid after ${period} days`,success:true})
                      
                                })
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

route.get("/loan",(req,res)=>{
    req.mysql.query("select * from loan where user_ID=?",[2],(err,results)=>{
        if(err){
            return res.status(500).json({error:"Failed to fetch records",success:false})
        }
        res.json(results)
    })
})

route.get("/contract",(req,res)=>{
    req.mysql.query("select * from contract where app_ID=? and state=?",["4128AEAD3156","Not Completed"],(err,results)=>{
        if(err){
            return res.status(500).json({error:"Failed to fetch records",success:false})
        }
        res.json(results)
    })
})
route.patch("/vi/loan/update",verifyToken,(req,res)=>{
    const {status,app_ID}=req.body
    req.mysql.query("update loan set State=? where app_ID=?",[status,app_ID],(err,results)=>{
        if(err){
            return res.status(500).json({error:"Internal server error",success:false})
        }
        res.json({"message":"Loan status updated",success:true})
    })
})
route.get("/vi/requests",verifyToken,(req,res)=>{
    try {
         req.mysql.query("select loan.app_ID, useraccount.firstName,useraccount.middleName ,useraccount.lastName,period,State as Status,interestRate,loanAmount,requests.app_ID from requests inner join useraccount on useraccount.User_ID=requests.borrower_ID inner join loan on loan.app_ID = requests.app_ID inner join loan_type on loan_type.ID = loan.type_ID where requests.lender_ID=?",[req.user.user_id],(err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).json({error:"Internal server error",success:false})
            }
            res.json({message:"Record fetched",success:true,data:results})
         })
    } catch (error) {
        return res.status(500).json({error:"Internal server error",success:false})
    }
})
export default route