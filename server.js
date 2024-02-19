const bodyParser =require("body-parser");
const express =require("express");
const cors =require('cors')
const dotenv =require('dotenv')
const app=express()
// allow cors origin
app.use(cors())

// parse json and form-data
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))

app.get("/",(req,res)=>{
    res.json({message:"npode envs"})
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})