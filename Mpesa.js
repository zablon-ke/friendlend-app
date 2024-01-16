import request from "request";
import express from 'express'

const route=express.Router()
const accessToken = (req, res, next)=> {
    try{
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        const auth = new Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    res.status(401).send({
                        "message": 'Something went wrong when trying to process your payment',
                        "error":error.message
                    })
                }
                else {
                    res.json({"message":body,response:response})

                    req.safaricom_access_token = body
                    next()
                }
            }
        )
    }catch (error) {

        console.error("Access token error ", error)
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error":error.message
        })
    }

}


route.get("/token",accessToken,(req,res)=>{
    
})

export default route