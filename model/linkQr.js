const mongoose = require('mongoose')

const qrLinkSchema = new mongoose.Schema({
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"user_mst",
            require:true,
        },
        qrLink:{
            type:String,
            require:true,
        },
        qrColor:{
            type:String,
            require:true,
        },
        qr_status:{
        type:String,
        enum:['enable','disable'],
        default:'enable',
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
})

module.exports = mongoose.model('qrLink_mst',qrLinkSchema)