require('dotenv').config()
const userModel = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const linkQrmodel = require('../model/linkQr')
const tokenBlacklist = require('../model/tokenBlacklist')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const resetPassModel = require('../model/resetPass')

// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// })


exports.testUser = async(req,res)=>{
     res.json({
        "msg":"this is just a test user"
    })
}

exports.regUser = async(req,res)=>{
    const uname = req.body.uname
    const upass = await bcrypt.hash(req.body.upass,12)
    const uemail = req.body.uemail

    try {
        const newUser = new userModel({
        "user_name":uname,
        "user_mail":uemail,
        "user_pass":upass
    })

    const saveUser = await newUser.save()
    res.json({"regsts":"0","msg":"User registered succesfully",saveUser})
    } catch (error) {
        res.json({"error":error})
    }
}

exports.logUser = async(req,res)=>{
    const uemail = req.body.uemail
    const upass = req.body.upass

    try {
        const userLogin = await userModel.findOne({"user_mail":uemail})

        if (!userLogin) {
            res.json({"loginsts":"1","msg":"User not found"})
        } else {
            const isMatch = await bcrypt.compare(upass,userLogin.user_pass)

            if (!isMatch) {
                res.json({"loginsts":"2","msg":"Wrong password"})
            } else {
                const token = jwt.sign(
                    {id:userLogin._id,user_mail:userLogin.user_mail},
                    process.env.JWT_USER_SECRET,
                    {expiresIn:'1h'}
                )
                res.json({"loginsts":"0","token":token,"msg":"Login successful"})
            }
        }
        
    } catch (error) {
        console.log(error);
        
    }

}

exports.addLinkQr = async(req,res)=>{
    const qrLink = req.body.qrLink
    const qrColor = req.body.qrColor
    const user = req.user.id

    try {
        const newLinkQr = new linkQrmodel({
            qrLink,
            qrColor,
            user,
        })
        const saveQr = await newLinkQr.save()
        res.json({"addsts":"0","msg":"QR Saved succesfully",saveQr})
    } catch (error) {
        res.json({"error":error,"addsts":"1","msg":"Unable to save QR"})
    }
}

exports.getQrLinks = async(req,res)=>{
    try {
        const qrLinks = await linkQrmodel.find({user:req.user.id})
        return res.json(qrLinks)
    } catch (error) {
        return res.json({"error":error})
    }
}

exports.logoutUser = async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    
    if (!token) {
        res.json({"msg":"no token found"})        
    }
    try {
        const tokenData = new tokenBlacklist(
            {token}
        )
        const saveBlcToken =await tokenData.save()
        res.json(saveBlcToken)
    } catch (error) {
        res.json({"error":error})
    }
}

exports.forgetPass = async(req,res)=>{
    const user_mail = req.body.email
    try {
        const user = await userModel.findOne({user_mail})
        if (!user) {
            return res.json({"forget_sts":"1","msg":"User not found"})
        }

        const token = crypto.randomBytes(32).toString("hex")


        await resetPassModel.deleteMany({userId:user._id})

        const newReset = new resetPassModel({
            userId:user._id,
            reset_token:token
        })

        await newReset.save()

        const resetLink = `${process.env.CLIENT_URL}/reset-pass/${token}`

        // await transporter.sendMail({
        //     to:user.user_mail,
        //     subject:" QR Generator Password reset link ",
        //     html:`
        //         <h1>Click the link below to reset your password .<h1/> 
        //         <a href="${resetLink}">${resetLink}<a/>           
        //     `
        // })
        res.json({"forget_sts":"0","msg":"reset password link send to your email","reset_link":resetLink})
    } catch (error) {
        res.json({"error":error})
    }
}

exports.resetPass = async(req,res)=>{

    const {token} = req.params
    const user_pass = req.body.password

    try {
        const resetToken = await resetPassModel.findOne({"reset_token":token})

        if (!resetToken) {
            return res.json({"reset_sts":"1","msg":"invalid or expired link"})
        }
        const upass = await bcrypt.hash(user_pass,12)

        const resetPass = await userModel.findOneAndUpdate(
            { _id:resetToken.userId},
            {$set:
                {user_pass:upass}
            },
            {new:true}
        )
        await resetPassModel.deleteMany({"reset_token":token})
        res.json({"reset_sts":"0","msg":"your password updated successfully"})
    } catch (error) {
        res.json({"error":error})
    }

}

exports.deleteQr = async(req,res)=>{
    const {qrId} = req.params
    try {
        const deleteqr = await linkQrmodel.findByIdAndDelete(qrId)
        if (deleteqr) {
            res.json({"delet_sts":"0","msg":"QR deleted successfully"})
        } else {
            res.json({"delet_sts":"1","msg":"Unable to delete QR"})
        }
    } catch (error) {
        req.json(error)
    }
}

exports.editQR = async(req,res)=>{
    const {qrId}  = req.params
    const qrLink = req.body.qrLink
    const qrColor = req.body.qrColor

    try {
        const updateQR = await linkQrmodel.findByIdAndUpdate(
            qrId,
            {qrLink,qrColor},
            {new:true}
        )
        res.json({"addsts":"0","msg":"QR Saved succesfully",updateQR})
    } catch (error) {
        res.json({"addsts":"1","msg":"Unable to save QR",error})
    }

}