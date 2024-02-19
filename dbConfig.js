const mysql2 =require('mysql2')
const dotenv =require('dotenv')


dotenv.config()
const USER=process.env.DB_USER
const PASSWORD=process.env.DB_PASSWORD
const DATABASE=process.env.DATABASE
const HOST=process.env.HOST
const PORT=process.env.DB_PORT
const dbConfig = {
    host: `${HOST}`,
    user: `${USER}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    port:PORT
  };


  const pool=mysql2.createPool(dbConfig)

  module.exports= {pool}
