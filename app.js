require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const DB = require('./DB')
const port = process.env.PORT
const userRoute = require('./route/userRoute')
// const userModel = require('./model/user.js')

const app = express()

//middlewares
app.use(bodyParser.json())
app.use(cors({
    origin:'http://localhost:5173'
}))

//all routes initiate here
app.use('/userApi',userRoute)




app.listen(port,(req,res)=>{
    console.log('\x1b[32m%s\x1b[0m',`SERVER IS RUNNING ON PORT ${port}`)
})
