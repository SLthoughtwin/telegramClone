import { Client } from 'pg' 
const { pgUser, pgHost, pgPass, pgPort,pgDB } = require("./index");
const client = new Client({
  user: pgUser,
  host: pgHost,
  database:pgDB,
  password:pgPass,
  port: pgPort,
});
client.connect( (err)=> {
  if (err) {
    return console.log("not connect with database", err);
  }
  console.log('db connect successfully')
});
export = client;













// const chechDB = async () =>{
    
//     try{ await client.connect
//         await client.query( "CREATE DATABASE telegram")
//     return true}
//     catch(err){
//        return false
// }
//     finally{client.end()}
// }
// chechDB().then(()=>console.log('connectdb'))