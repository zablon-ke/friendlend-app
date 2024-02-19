const bodyParser =require("body-parser")
const express =require("express")
const path =require("path")
const { pool } =  require("./db2.js");
const { route: userRoutes } = require("./userRoutes.js")
const { route: appRoutes } = require("./appRoutes.js")
const { route: transRoutes } = require("./transRoutes.js")
const { route: adminRoutes } = require("./adminRoutes.js")
const { route: MpesaRoutes } = require("./Mpesa.js")
const { route: paymentRoutes } = require("./paymentRoutes.js")
const { route: chatRoutes } = require("./chatRoutes.js")

const circular = require("circular-json")
const cors =require('cors')
const dotenv =require('dotenv')


dotenv.config()
const app=express()
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    });
});
// allow cors origin
app.use(cors())

// parse json and form-data
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))


app.use((req,res,next)=>{
   try{
    pool.getConnection((err,connection)=>{
        if(err){
             console.log(err)
            return res.status(500).send("Connection error  try again later "+err)
        }
        req.mysql=connection
        next()
    })
   }
   catch(error){
    return res.send("Internal server error ")
   }
 
})


app.use("/user",userRoutes)
app.use("/app",appRoutes)
app.use("/admin",adminRoutes)
app.use("/p",MpesaRoutes)
app.use("/tr",transRoutes)
app.use("/vi",paymentRoutes)
app.use("",chatRoutes)


app.get("/",(req,res)=>{
try{
    res.json({message:"Server is up and running"})
  
}
catch(error){
    res.send("Internal server error")
}
   
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`app running at http://localhost:${PORT}`)
})