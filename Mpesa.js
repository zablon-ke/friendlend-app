import express from 'express'
import axios from "axios";
import jwt from 'jsonwebtoken';
import fs from 'fs'
import cors from 'cors'
const route=express.Router()

route.use(cors())
const accessToken = (req, res, next)=> {
    const auth = {'Authorization': 'Basic ' +Buffer.from(process.env.CONSUMER_KEY+":"+process.env.CONSUMER_SECRET).toString('base64')};
    const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    axios.get(url,{headers:auth}).then(response=>{
        
        req.access_token=response['data']['access_token']
        next()
    }).catch(error=>{
        res.json(error)
    })
}
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
const stkPush=(amount,phone,req,res)=>{
    const url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" 
    const headers={
        "Authorization":`Bearer ${req.access_token}`,
        "Content-Type":"application/json"
    }
    let bsc=process.env.BUSINESS_SHORT_CODE
    let timestamp=calculateTimestamp()
    
   const payload= {
        "BusinessShortCode": bsc,
        "Password": Buffer.from(`${bsc}${process.env.PASSKEY}${timestamp}`).toString("base64"),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": process.env.PARTY_B,
        "PhoneNumber": phone,
        "CallBackURL": `https://ace0-102-167-66-141.ngrok-free.app/callback`,
        "AccountReference": "GMD HOTEL",
        "TransactionDesc": "Taxayo"
    }

    axios.post(url,payload,{headers}).
    then(response=>{
        const data=response['data']
        let MerchantRequestID= data['MerchantRequestID']
        let CheckoutRequestID= data['CheckoutRequestID']
        let ResponseCode= data['ResponseCode']
        let ResponseDescription= data['ResponseDescription']
        let CustomerMessage= data['CustomerMessage']
        console.log(CheckoutRequestID)
        fs.appendFile("checkouts.txt",CheckoutRequestID+" "+new Date().getFullYear()+""+new Date().getMonth()+1+""+new Date().getDate()+""+new Date().getHours()+" \n",(e=>{
            if(e){
                console.log(e)
            }
        }))
        res.json({message:CustomerMessage,success:true})
    }).
    catch(error=>{
        
        console.log(error)
        res.json(error)
    })
}
const checkTransaction=(req,res)=>{
    const url="https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
    let timestamp=calculateTimestamp()
    
    const headers={
        "Authorization":`Bearer ${req.access_token}`,
        "Content-Type":"application/json"
    }
    let checkouts=["ws_CO_23012024042412073769702562","ws_CO_27012024075632262769702562",["ws_CO_27012024084956675769702562"]]
    const payload={    
        "BusinessShortCode":process.env.BUSINESS_SHORT_CODE,    
        "Password": Buffer.from(`${process.env.BUSINESS_SHORT_CODE}${process.env.PASSKEY}${timestamp}`).toString("base64"),
        "Timestamp": timestamp,  
        "CheckoutRequestID": checkouts[0],    
     }    
     axios.post(url,payload,{headers})
     .then(response=>{
        console.log(response)
        res.json(response.json())
     })
     .catch(error=>{
        console.log(error)
        res.json(error)
     })
}
const register=(req,res)=>{
    const url="https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    const payload={    
        "ShortCode": process.env.BUSINESS_SHORT_CODE,
        "ResponseType":"Completed",
        "ConfirmationURL":`${process.env.BASE_URL}/confirm`,
        "ValidationURL":`${process.env.BASE_URL}/validate`
     }
     const headers={
        "Authorization" :`Bearer ${req.access_token}`,
        "Content-Type":"application/json"
     }
     axios.post(url,payload,{headers})
     .then(response=>{
        console.log(response['data']) 
     })
     .catch(error=>{
        console.log("error")
     })
}
route.post("/confirm",(req,res)=>{
    console.log(req.body)
})
route.post("/validate",(req,res)=>{
    console.log(req.body)
})

route.post("/stk",accessToken,(req,res)=>{
    
    // let {phone}=req.body
    // stkPush("1",phone,req,res)
    register(req,res)
    // checkTransaction(req,res)
})
route.post("/callback",(req,res)=>{
    console.log(req.body)
    fs.writeFile("transactions.json",JSON.stringify(req.body),(e=>{
        console.log("Logs saved")
    }))
    res.send("Callback")
//    fs.writeFileSync("transactions.txt",req.body)
})


export default route