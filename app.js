require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const DB = require('./DB')
const userRoute = require('./route/userRoute')


const app = express()

//middlewares
app.use(cors({
    origin:'*'
}))
app.use(bodyParser.json())
app.use(express.json());

//test route
app.get('/ping', (req, res) => {
    console.log("Ping endpoint hit!");
  res.send('pong');
})

//all routes initiate here
app.use('/userApi',userRoute)

console.log("APP RUNNING")

module.exports = app
