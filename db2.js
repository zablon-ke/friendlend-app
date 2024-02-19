const mysql2 =require('mysql2')
const dotenv =require('dotenv')


dotenv.config()
const USER="root"
const PASSWORD=""
const DATABASE="friendlend"
const HOST="localhost"
const PORT="3306"
const dbConfig = {
    host: `${HOST}`,
    user: `${USER}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    port:PORT
  };


  const pool=mysql2.createPool(dbConfig)

  module.exports= {pool}
