import express from 'express'
import axios from "axios";
import jwt from 'jsonwebtoken';
import fs from 'fs'

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
    const minute=date.getMinutes().toString().padStart(2,"0")
    const hour=date.getHours().toString().padStart(2,"0")
    const day=date.getDate().toString().padStart(2,"0")
    let timestamp=`${date.getFullYear()}${month}${day}${hour}${minute}${date.getSeconds()}`
    let bsc=process.env.BUSINESS_SHORT_CODE
    
   const payload= {
        "BusinessShortCode": bsc,
        "Password": Buffer.from(`${bsc}${process.env.PASSKEY}${timestamp}`).toString("base64"),
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
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
        res.json({message:CustomerMessage,success:true})
    }).
    catch(error=>{
        res.json(error)
       console.log(error)
    })
}
route.post("/stk",accessToken,(req,res)=>{
    
    let {phone}=req.body
    console.log(phone)
    stkPush("1",phone,req,res)
})
route.post("/call",(req,res)=>{
   console.log(req.body)
   fs.writeFileSync("transactions.txt",req.body)
   res.send(req.body)
})
route.get("/call",(req,res)=>{
    console.log(req.body)
    res.send("Hello")

 })

export default route