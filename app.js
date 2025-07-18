require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const cors = require('cors')
const DB = require('./DB')
const userRoute = require('./route/userRoute')


const app = express()

//middlewares
app.use(bodyParser.json())
app.use(express.json());
app.use(cors({origin:'*'}))

app.get('/',(req,res)=>{
    res.send("hello from vercel")
}) 

app.get('/ping', (req, res) => {
    console.log("HIT");
  res.send('pong');
});



//all routes initiate here
// app.use('/userApi',userRoute)



module.exports = app
