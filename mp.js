import express from 'express'
import Mpesa from 'mpesa-node'
import dotenv from 'dotenv'
dotenv.config()
const route=express.Router();


const calculateTimestamp=()=>{
    let date=new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const minute=date.getMinutes().toString().padStart(2,"0")
    const hour=date.getHours().toString().padStart(2,"0")
    const day=date.getDate().toString().padStart(2,"0")
    const second=date.getSeconds().toString().padStart(2,"0")
    let timestamp=`${date.getFullYear()}${month}${day}${hour}${minute}${second}`

    return timestamp
}

const mpesa_api=new Mpesa({
    consumerKey:process.env.CONSUMER_KEY,
    consumerSecret:process.env.CONSUMER_SECRET,
    environment: 'sandbox',
    shortCode: process.env.BUSINESS_SHORT_CODE,
    initiatorName: 'GMD HOTEL',
    lipaNaMpesaShortCode: process.env.BUSINESS_SHORT_CODE,
    lipaNaMpesaShortPass: Buffer.from(`${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${calculateTimestamp()}`).toString("base64")

})



const register=(req,res,next)=>{
    try {
         mpesa_api.c2bRegister(process.env.BASE_URL+"/confirm",process.env.BASE_URL+"/validate",process.env.BUSINESS_SHORT_CODE).then(response=>{
         req.resp=response
         console.log(response)
        next()
        }).
        catch(error=>{
            req.error=error
            console.log(error)
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

route.post("/stk",register,(req,res)=>{
    try{
        
        console.log("Served")

    }
    catch(error){
        
    }
})





export default route