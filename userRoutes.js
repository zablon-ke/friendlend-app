import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import fs from 'fs'
import { content } from "./File.js";
import multer from "multer";
import path from "path";
import  twilio from "twilio";


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

route.post("/sign_up",(req,res)=>{
    try {
        const {mobile,password} =req.body 

        req.mysql.query("insert into logins(mobile,password) values(?,?)",[mobile,password],(err,results)=>{
            if(err){
                 console.log(err)
                if(err['sqlMessage'].includes("Duplicate entry")){

                    if( err['sqlMessage'].includes("mobile"))
                     {
                        return res.status(403).json({message:"Account  already exists",success:false})
                     }
                     if( err['sqlMessage'].includes("ID")){
                        
                        return res.status(403).json({message:"Provide your unique National ID",success:false})
                  }
               return res.status(500).json({error:"Failed to register",success:false})
            }
        }
            res.json({message:"Account created successfully",success:true})
    })
       
    } catch (error) {
        res.json({error:"Internal server error "+error,success:false})
    }finally{
        req.mysql.release()
    }

})


route.post("/add",(req,res)=>{
    try{
        const {firstName,middleName,lastName,Email,gender,phone,ID,DOB,rol}=req.body
        req.mysql.query("insert into useraccount(Email,firstName,middleName,lastName,gender,ID,DOB,phone,rol) values(?,?,?,?,?,?,?,?,?)",[Email,firstName,middleName,lastName,gender,ID,DOB,phone,rol],(err,results)=>{
            if(err){
                
                if(err['sqlMessage'].includes("Duplicate entry")){

                    if( err['sqlMessage'].includes("userName"))
                    {
                       return res.status(403).json({error:"UserName already exists",success:false})
                    }
                    if( err['sqlMessage'].includes("Email"))
                     {
                        return res.status(403).json({error:"Account with email already exists",success:false})
                     }
                     if( err['sqlMessage'].includes("ID")){
                        
                        return res.status(403).json({error:"Provide your unique National ID",success:false})
                  }
                  if( err['sqlMessage'].includes("phone")){
                        
                    return res.status(403).json({error:"Phone number already used",success:false})
              }
                }
                console.log(err)
               
              return  res.status(500).json({error:"internal server error",success:false})
            }
            res.json({message:"Account created successfully",success:true})
            // sendMail(Email)
        })
    }
    catch(error){
        console.log(error)
        res.status(403).json({"error":"Erro Saving data ",success:false})
    }
})


route.post("/logs",(req,res)=>{
    req.mysql.query("select * from systemlogs where user_ID=?",[req.user.user_id],(err,results)=>{
        if(err){
            return res.status(500).json({"error":"Internal server error",success:false})
        }
        res.json({message:"Data available",success:false,data:results})
    })
})
route.get("/lender",verifyToken,(req,res)=>{
    try{
        req.mysql.query("select * from useraccount left join Lender on Lender.user_ID=useraccount.User_ID where useraccount.User_ID=?",[req.user.user_id],(err,results)=>{
            if(err){
                return  res.status(500).json({error:"internal server error",success:false})
            }
            if(results.length >0){
                res.json({message:"Data Retrieved",success:true,data:results[0]})
            }
            else{
                res.status(422).json({error:"No data for the user available",success:false})
            }
        })

    }catch(error){
        return  res.status(500).json({error:"internal server error",success:false})
    }
})

route.get("/lenders",verifyToken,(req,res)=>{
    try{
    const{search} =req.query
    req.mysql.query("select useraccount.User_ID,firstName,lastName,phone,rol, count(*) as clients from useraccount left join requests on useraccount.user_ID = requests.Lender_ID where useraccount.rol=?  and (useraccount.User_ID LIKE CONCAT('%', ?, '%') OR useraccount.firstName LIKE CONCAT('%', ?, '%')  OR useraccount.lastName LIKE CONCAT('%', ?, '%')) group by useraccount.user_ID;",["Lender",search,search,search,search],(err,results)=>{
        if(err){
            return  res.status(500).json({error:"internal server error",success:false})
        }
        res.json({message:"Data fetched",success:true,data:results})
    })
}
catch(error){
    return  res.status(500).json({error:"internal server error",success:false})
}
finally{
    req.mysql.release()
}
})

route.patch("/update/lender",verifyToken,(req,res)=>{

    try{
      
    const{app_ID,lender_ID} =req.body

    req.mysql.query("insert into requests(app_ID,lender_ID,borrower_ID) values(?,?,?)",[app_ID,lender_ID,req.user.user_id],(err,requests)=>{
        if(err){
            console.log(err)
            return  res.status(500).json({error:"internal server error",success:false})
        }
        res.json({message:"Lender requests submitted",success:true})
    })
}
catch(error){

}
finally{
    req.mysql.release()
}
  
}
)
route.post("/login",(req,res)=>{

    const secret=process.env.SECRET || crypto.randomBytes(32).toString("hex")
    try {
     const { mobile, password } = req.body;
 
     req.mysql.query("select mobile,password,User_ID,rol from logins inner join useraccount on useraccount.phone=logins.mobile where logins.mobile=? and logins.password =?",[mobile,password],(err,results)=>{
       if(err){
         return  res.status(401).json({"error":"Invalid request",success:false})
       }
       if(results.length >0){
        const payload={user_id:results[0].User_ID}
        const token=jwt.sign(payload,secret,{expiresIn :"1d"})
  
        updateToken(req,token,mobile)
        sendSms("8844882")
        
     res.json({message:"Login successful","validated":true,success:true,data:{token:token,results:results[0]}})
       }
     else{
          
     res.status(422).json({error:"Wrong mobile or password","validated":false,success:false})
     }

    })
    } catch (error) {

    res.status(500).send("internal server error "+error)
    }
})

route.get("/",verifyToken,(req,res)=>{
    try{
    req.mysql.query("select * from UserAccount where user_ID = ?",[req.user.user_id],(err,results)=>{
        if(err){
           return res.json({message:"Failed to fetch details",success:false,data:req.user})
        }
        var profile=results[0]
        req.mysql.query("select * from loan inner join loan_type on loan.type_ID=loan_type.ID where loan.user_ID=? order by Date_applied DESC",[req.user.user_id],(err,results)=>{
            if(err){
                console.log(err)
                return res.json({message:"Failed to fetch details",success:false,data:req.user})
            }
            let loan_info=results
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
}
catch(error){

}
    finally{
        req.mysql.release();
    } 
})


route.get("/users",(req,res)=>{
     try{
    req.mysql.query("select user_ID,firstName,middleName,lastName,phone,Email,gender,DOB,rol from UserAccount",(err,results)=>{
        if(err){
           return res.json({message:"Failed to fetch details",success:false})
        }

console.log(results)
        res.json({results:results})
    })} catch(error){

    }
     finally{
        req.mysql.release();
    } 
})
route.post("/emergency/add",verifyToken,(req,res)=>{
    try{
        let saved=true;
        req.body.forEach(item => {
            const{fullname,mobile,relation}=item
                 req.mysql.query("insert into emergency(fullName,phone,relationship,user_ID) values(?,?,?,?)",[fullname,mobile,relation,req.user.user_id],(err,results)=>{
            if(err){

                console.log(err)
                saved=false;
                
                return res.status(500).json({message:"Failed to add emergency contact",success:false})
            
            }
          
     } )
        }
    
        );
   if(saved){
    res.json({message:"Emergency contact saved",success:true})
   }
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error",success:false})
    } finally{
        req.mysql.release();
    } 
})

const updateToken=(req,token,mobile)=>{
    try{
        req.mysql.query("update  logins set token=? where mobile=?",[token,mobile],(err,results)=>{
            if(err){
              return res.status(200).json({"message":"Failed to login",success:false})
            }
        })
    }
    catch(error){
        res.status(500).json({"message":"Internal server error",success:false})
    } 
    finally{
        req.mysql.release();
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
      res.json({message:"Failed to verfiy your account"})
    } finally{
        req.mysql.release();
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
      finally{
           req.mysql.release();
       } 
})


const sendSms=(phone)=>{
    try{
        const client=new twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_ACOUNT_TOKEN)

        // client.messages.create({
        //     body: 'Hello from twilio-node',
        //     to: '+254769702562', // Text your number
        //     from: '+254769702562',
        // }).then(message=>{
        //     console.log(message.sid)
        // }).catch(error=>{
        //     console.log(error)
        // })
    }
    catch(error){
        fs.appendFile("log.txt",error,()=>{
            console.log("Error Logged")
        })
    }

}
const uploadDocument=()=>{
   
}
export default route;