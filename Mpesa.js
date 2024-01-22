import express from 'express'
import axios from "axios";
import jwt from 'jsonwebtoken';

const route=express.Router()
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
const stkPush=(amount,phone,req,res)=>{
    const url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" 
    const headers={
        "Authorization":`Bearer ${req.access_token}`,
        "Content-Type":"application/json"
    }
    let date=new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    let timestamp=`${date.getFullYear()}${month}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
    let bsc=process.env.BUSINESS_SHORT_CODE
   const payload= {
        "BusinessShortCode": bsc,
        "Password": Buffer.from(`${bsc}${process.env.PASSKEY}${timestamp}`).toString("base64"),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": "600981",
        "PartyB": process.env.PARTY_B,
        "PhoneNumber": phone,
        "CallBackURL": process.env.CALLBACK,
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
    }).
    catch(error=>{
        res.json(error)
       console.log(error)
    })
}
route.post("/stk",accessToken,(req,res)=>{
    
    stkPush("1","254769702562",req,res)
})
route.post("/call",(req,res)=>{
   console.log(req.body)
   res.send(req.body)
})
route.get("/call",(req,res)=>{
    console.log("get request")
    console.log(req.body)
    res.send(req.body)
 })

export default route