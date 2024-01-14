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
            var loan_info=results[0]
            if(results.length < 0){
               return res.json({message:"Success ",data:{loan:loan_info,profile:profile,loan:{}}})
            }

            let id=profile['user_ID']
            req.mysql.query("select * from emergency where user_ID=?",[id],(err,results)=>{

                if(err){

                    console.log(err['sqlMessage'])
                }
                let emergency=results
               res.json({message:"data available",success:true,data:{profile:profile,loan:{},emergency:emergency}})
       
             })

        })
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



export default route;