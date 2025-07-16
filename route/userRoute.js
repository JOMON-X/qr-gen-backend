const express = require('express')

const router =  express.Router()

const {testUser,regUser, logUser,addLinkQr,getQrLinks,logoutUser, forgetPass, resetPass, deleteQr, editQR} = require('../controller/userController')


const uAuth = require('../middleware/userAuthentication')


//http://localhost:5000/userApi/testUser
router.get('/testUser',uAuth,testUser)

//http://localhost:5000/userApi/regUser
router.post('/regUser',regUser)

//http://localhost:5000/userApi/loginUser
router.post('/loginUser',logUser)

//http://localhost:5000/userApi/forgetPass
router.post('/forgetPass',forgetPass)

//http://localhost:5000/userApi/reset-pass/token
router.post('/reset-pass/:token',resetPass)

//http://localhost:5000/userApi/addLinkQr
router.post('/addLinkQr',uAuth,addLinkQr)

//http://localhost:5000/userApi/getQrLinks
router.get('/getQrLinks',uAuth,getQrLinks)

//http://localhost:5000/userApi/logoutUser
router.get('/logoutUser',uAuth,logoutUser)

//http://localhost:5000/userApi/deleteQr/:qrId
router.get('/deleteQr/:qrId',uAuth,deleteQr)

//http://localhost:5000/userApi/editQR/:qrId
router.post('/editQR/:qrId',uAuth,editQR)




module.exports = router