import request from "request";
import express from 'express'
import axios from "axios";
import fetch from "node-fetch";

const route=express.Router()
const accessToken = (req, res, next)=> {
    const auth = Buffer.from(process.env.CONSUMER_KEY+":"+process.env.CONSUMER_SECRET).toString('base64');

    let headers ={"Authorization": "Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==","Content-Type":"application/json; charset=utf-8"}
    // fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { headers:headers })
    // .then(response => {
    //     res.send(response)
    //     console.log("JSON")
    // })
    // .catch(error => {
    //     res.json(error)
    // });
    // next()


    let url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
//     let auth=new Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
//    console.log(auth)
// let unirest = require('unirest');
// let req = unirest('GET', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
// .headers({ 'Authorization': 'Bearer cFJZcjZ6anEwaThMMXp6d1FETUxwWkIzeVBDa2hNc2M6UmYyMkJmWm9nMHFRR2xWOQ==' })
// .send()
// .end(res => {
//     if (res.error) throw new Error(res.error);
//     console.log(res.raw_body);
// });

    // let headers={"Authorization": "Basic " + auth,
    // "Content-Type":"application/json; charset=utf8"}
    axios.get(url,{headers:headers}).then(response=>{
        
        res.send(response)
    }).catch(error=>{
        res.json(error)
        
    })
}


route.get("/token",accessToken,(req,res)=>{
    
})

export default route