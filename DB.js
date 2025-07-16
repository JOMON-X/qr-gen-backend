require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL)

mongoose.connection.on("connected",()=>{
    console.log('\x1b[32m%s\x1b[0m','DB connected');
})

mongoose.connection.on("error",(error)=>{`error is ${error}`})

module.exports = mongoose