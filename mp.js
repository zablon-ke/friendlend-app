import express from 'express'
import Mpesa from 'mpesa-node'
import dotenv from 'dotenv'
import path from 'path'
import CircularJSON from 'circular-json'
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
    lipaNaMpesaShortPass: process.env.PASSKEY,
    securityCredential: process.env.CREDENTIAL,
    certPath: path.resolve('./security.cer')
})


const register=(req,res,next)=>{
    try {
         mpesa_api.c2bRegister(process.env.BASE_URL+"/confirm",process.env.BASE_URL+"/validate",process.env.BUSINESS_SHORT_CODE).then(response=>{
         req.resp=response
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
    
        const{phone} =req.body
        const testMSISDN = phone
        const accountRef = Math.random().toString(35).substr(2, 7)
        mpesa_api.lipaNaMpesaOnline(testMSISDN, "1", process.env.BASE_URL + '/payment/success', accountRef).then(response=>{

            const jsonresponse=CircularJSON.stringify(response)
            console.log(response['data'])
            res.json(CircularJSON.parse(jsonresponse)['data'])
        }).catch(error=>{
            const serializedError = CircularJSON.stringify(error);

            res.json(serializedError);
        })
       
   
})



export default route