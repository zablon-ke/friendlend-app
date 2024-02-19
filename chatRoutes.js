const  express = require('express') 
const { randomUUID } =require('crypto') 
const jwt = require('jsonwebtoken') 


const route=express.Router()

const verifyToken=(req,res,next)=>{
    const secret=process.env.SECRET
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
        const {receiver_ID,subject,content,sender_ID,chat_ID}=req.body

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
        req.mysql.query("insert into messages(message_ID,receiver_ID,chat_ID,subject,content,state,sender_ID) values(?,?,?,?,?,?,?)",[message_ID,receiver_ID,chat_ID,subject,content,"Unread",sender_ID],(err,results)=>{
            if(err){
               return res.status(500).json({error:"Internal Server error",success:false})
            }
            console.log(req.body)
            res.json({message:"Message Send",success:true,data:""})
        })
    } catch (error) {
        return res.status(500).json({error:"Internal Server error",success:false})
    }  finally{
        req.mysql.release();
    }
})
route.get("/chats",verifyToken,(req,res)=>{
    try {

        const {other}=req.query;
        req.mysql.query("select * from messages where (receiver_ID=? and sender_ID=?) or (receiver_ID=? and sender_ID=?)  order by date_send ASC",[other,req.user.user_id,req.user.user_id,other],(err,messages)=>{
            if(err){
                console.log(err)
                return res.status(500).json({error:"Failed to fetch messages",success:false})
            }
            return res.json({message:"Data available",success:true,data:messages,self:req.user.user_id})
        })
    } catch (error) {
        res.status(500).json({error:"Failed ",success:false}) 
    }  finally{
        req.mysql.release();
    }
})

    
route.get("/chats/all",verifyToken,(req,res)=>{
    try {
 
const query = `
WITH RankedMessages AS (
  SELECT
    m.*,
    ROW_NUMBER() OVER (PARTITION BY m.chat_ID ORDER BY m.date_send DESC) AS row_num
  FROM messages m
)
SELECT
  rm.*,
  sender_info.firstName AS sender_firstName,
  sender_info.lastName AS sender_lastName,
  receiver_info.firstName AS receiver_firstName,
  receiver_info.lastName AS receiver_lastName
FROM
  RankedMessages rm
INNER JOIN
  useraccount sender_info ON rm.sender_ID = sender_info.User_ID
INNER JOIN
  useraccount receiver_info ON rm.receiver_ID = receiver_info.User_ID
WHERE
  rm.row_num = 1
  AND (rm.receiver_ID = ? or rm.sender_ID=?) ;
`;
        req.mysql.query(query,[req.user.user_id,req.user.user_id],(err,messages)=>{
            if(err){
               
                return res.status(500).json({error:"Failed to fetch messages",success:false})
            }
            return res.json({message:"Data available",success:true,data:messages,self:req.user.user_id})
        })
    }
    
    catch (error) {
        res.status(500).json({error:"Failed ",success:false}) 
    }
    finally{
        req.mysql.release();
    }
})


module.exports ={ route }