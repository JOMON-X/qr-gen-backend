require('dotenv').config()
const jwt = require('jsonwebtoken')
const tokenBlacklist = require('../model/tokenBlacklist')

const userAuthentication = async(req,res,next)=>{
    const header = req.header('Authorization')

    if (!header || !header.startsWith('Bearer ')) {
        return res.json({"token_sts":"1","msg":"Token not found or invalid token"})
    } else {
        const token = header.split(' ')[1]

        const isBlackList = await tokenBlacklist.findOne({token})

        if (isBlackList) {
             return res.json({"token_sts":"2","msg":"Token is not valid"})
        }

        try {
            const verified = jwt.verify(token,process.env.JWT_USER_SECRET)
            req.user = verified
            next()
        } catch (error) {
            return res.json({"token_sts":"2","msg":error})
        }
    }
}

module.exports = userAuthentication