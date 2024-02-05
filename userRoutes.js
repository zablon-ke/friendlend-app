import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import fs from 'fs'
import { content } from "./File.js";
import multer from "multer";
import path from "path";


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

if(!fs.existsSync("uploads")){

    fs.mkdirSync("uploads")
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload=multer({storage:storage})

route.post("/add",(req,res)=>{
    try{
        const {firstName,middleName,lastName,userName,password,Email,gender,ID,DOB,phone,rol}=req.body
        req.mysql.query("insert into useraccount(userName,passwrd,Email,firstName,middleName,lastName,gender,ID,DOB,phone,rol) values(?,?,?,?,?,?,?,?,?,?,?)",[userName,password,Email,firstName,middleName,lastName,gender,ID,DOB,phone,rol],(err,results)=>{
            if(err){
                
                if(err['sqlMessage'].includes("Duplicate entry")){

                    if( err['sqlMessage'].includes("userName"))
                    {
                       return res.status(403).json({message:"UserName already exists",success:false})
                    }
                    if( err['sqlMessage'].includes("Email"))
                     {
                        return res.status(403).json({message:"Account with email already exists",success:false})
                     }
                     if( err['sqlMessage'].includes("ID")){
                        
                        return res.status(403).json({message:"Provide your unique National ID",success:false})
                 
                  }
                  if( err['sqlMessage'].includes("phone")){
                        
                    return res.status(403).json({message:"Phone number already used",success:false})
              }
                }
                console.log(err)
              return  res.status(500).json({message:"internal server error",success:false})
            }
            res.json({message:"Account created successfully",success:true})

            sendMail(Email)
        })
    }
    catch(error){

    }
})

route.post("/login",(req,res)=>{

    const secret=process.env.SECRET || crypto.randomBytes(32).toString("hex")
    try {
     const { userName, password } = req.body;
 
     req.mysql.query("select user_ID,userName,Email,phone,firstName,middleName,lastName,gender,DOB,rol from UserAccount where userName =? and passwrd =?",[userName,password],(err,results)=>{
       if(err){
         return  res.status(401).send("Invalid request")
       }
       const payload={user_id:results[0].user_ID}
       const token=jwt.sign(payload,secret,{expiresIn :"1d"})
 
       updateToken(req,token,results[0].user_ID)
  
     res.json({message:"Login successful","validated":true,data:{token:token,results:results[0]}})
    })
    } catch (error) {

    res.status(500).send("internal server error "+error)
    }
   
})

route.get("/",verifyToken,(req,res)=>{
    
    req.mysql.query("select user_ID,userName,firstName,middleName,lastName,phone,Email,gender,DOB,rol from UserAccount where user_ID = ?",[req.user.user_id],(err,results)=>{
        if(err){
           return res.json({message:"Failed to fetch details",success:false,data:req.user})
        }
        var profile=results[0]
        req.mysql.query("select * from loan where user_ID=?",[req.user.user_id],(err,results)=>{
            if(err){
                console.log(err)
                return res.json({message:"Failed to fetch details",success:false,data:req.user})
            }
            let loan_info=results[0]
            if(results.length < 0){
               return res.json({message:"Success ",data:{loan:loan_info,profile:profile,loan:{}}})
            }

            let id=profile['user_ID']
            req.mysql.query("select * from emergency where user_ID=?",[id],(err,results)=>{

                if(err){

                    console.log(err['sqlMessage'])
                }
                let emergency=results
               res.json({message:"data available",success:true,data:{profile:profile,loan:loan_info,emergency:emergency}})
       
             })

        })
    })
})
route.get("/users",(req,res)=>{
     
    req.mysql.query("select user_ID,userName,firstName,middleName,lastName,phone,Email,gender,DOB,rol from UserAccount",(err,results)=>{
        if(err){
           return res.json({message:"Failed to fetch details",success:false})
        }

        res.json(results)
    })
})
route.post("/emergency/add",verifyToken,(req,res)=>{
    try{
        const{firstName,lastName,phone,relationship,user_ID}=req.body;
        req.mysql.query("insert into emergency(firstName,lastName,phone,relationship,user_ID) values(?,?,?,?,?)",[firstName,lastName,phone,relationship,user_ID],(err,results)=>{
            if(err){
                if(err['sqlMessage'].includes("Duplicate entry")){
                    if( err['sqlMessage'].includes("phone"))
                    {
                       return res.status(403).json({message:"Emergency contact already exists",success:false})
                    }
                }
                return res.status(500).json({message:"Failed to add emergency contact",success:false})
            }
            res.json({message:"Emergency contact saved",success:true})
     } )
    }
    catch(error){

    }
})

const updateToken=(req,token,user_id)=>{
    try{
        req.mysql.query("update  userAccount set token=? where user_ID=?",[token,user_id],(err,results)=>{
            if(err){
              return res.status(200).json({"message":"Failed to login",success:false})
            }
        })
    }
    catch(error){
        res.status(500).json({"message":"Internal server error",success:false})
    }
}
const sendMail=(email)=>{
    try {
        const transporter= nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Verification ',
            text: `Verify your account to enjoy amazing limits with friendlend http://localhost:3000/user/verify?email=${email}`,
            html:content(email)
            
        };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);}
            })
    } catch (error) {
        console.log(error)
    }
}

route.get("/verify",(req,res)=>{
    try{
      const email=req.query.email
        req.mysql.query('update useraccount set Status=? where Email=?',["verified",email],(err,result)=>{
            if(err){
               return res.send("Failed to verify email")
            }
            if(result){
                res.json({message:"Account Verified",success:true})
            }
        })
    }  
    catch(error){

    }
})
route.post("/add/document",upload.single("file"),(req,res)=>{
    try {
        const {user_ID,document_type} =req.body
        if(user_ID ==null || user_ID ==""){
            fs.unlinkSync(`uploads/${req.file.filename}`)
            return res.json({error:"failed"})
        }
        if(!req.file){
            return res.status(400).json({error:"No file uploaded",success:false});
        }
        req.mysql.query("select * from useraccount where user_ID =?",[user_ID],(err,results)=>{
            if(err){
                return res.status(500).json({error:"Failed ",success:false})
            }

            if(results.length > 0){

                const uploaded=req.file
                const filename=uploaded.filename
                req.mysql.query("insert into documents(user_ID,document_type,fileName) values(?,?,?)",[user_ID,document_type,filename],(err,results)=>{
                    if(err){
                            fs.unlinkSync(`uploads/${req.file.filename}`)
                            return res.status(500).json({error:"Internal server error",success:false})
                        }
                        return res.json({message:"Document uploaded",success:true})
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.json({error:"Failed",success:false})   
    }
})

const uploadDocument=()=>{
   
}
export default route;