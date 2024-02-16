import mysql2 from 'mysql2'

const USER="root"
const PASSWORD=""
const DATABASE="friendlend"
const HOST="localhost"
const dbConfig = {
    host: `${HOST}`,
    user: `${USER}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    timezone: "UTC"
  };


  const pool=mysql2.createPool(dbConfig)

  export default pool
