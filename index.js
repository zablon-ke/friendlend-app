import bodyParser from "body-parser";
import mysql from "mysql2"
import express from "express";
import pool from "./dbConfig.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app=express();
app.use(cors())

// parse json and form-data
app.use(express.json())
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

app.get("/",(req,res)=>{
    req.mysql.query("SELECT * from UserAccount",(err,results)=>{
        if(err){
           return res.status(500).send("Internal server error")
        }
        res.json(results)
    })
})

app.post("/login",(req,res)=>{

   const secret=process.env.SECRET || crypto.randomBytes(32).toString("hex")
   try {
    const { phone, password } = req.body;

    req.mysql.query("select * from UserAccount where phone =? and passwrd =?",[phone,password],(err,results)=>{
      if(err){
        return  res.status(401).send("Invalid request")
      }
      const payload={user_id:results[0].user_id}
      const token=jwt.sign(payload,secret,{expiresIn :"1d"})

      updateToken(req,token,results[0].user_id)
 
    res.json({message:"Login successful","validated":true,data:{token:token,results:results[0]}})
         
    })
   } catch (error) {

    res.status(500).send("internal server error "+error)
   }
})
const updateToken=(req,token,user_id)=>{
    try{
        req.mysql.query("update  userAccount set token=? where user_id=?",[token,user_id],(err,results)=>{
            if(err){

              return 
            }
        })
    }
    catch(error){

        res.status(500).json({"message":"Internal server error",success:false})
    }
}
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
app.get("/user",verifyToken,(req,res)=>{
    
    req.mysql.query("select user_id,phone from UserAccount where user_id = ?",[req.user.user_id],(err,results)=>{
        if(err){
           return res.json({message:"Failed to fetch details",success:false,data:req.user})
        }
        var login=results[0]
        req.mysql.query("select * from borrower_info where acc_id=?",[req.user.user_id],(err,results)=>{
            if(err){
                console.log(err)
                return res.json({message:"Failed to fetch details",success:false,data:req.user})
            }
            var profile_info=results[0]
            if(results.length < 0){
               return res.json({message:"Success ",data:{profile:profile_info,lg:login,loan:{}}})
            }

            let id=profile_info['ID']
            req.mysql.query("select * from emergency where b_id=?",[id],(err,results)=>{

                if(err){

                    console.log(err['sqlMessage'])

                }

                let emergency=results
                res.json({message:"data available",success:true,data:{profile:profile_info,lg:login,loan:{},emergency:emergency}})
       
            })

        })
    })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})