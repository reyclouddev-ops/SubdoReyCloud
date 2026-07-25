const mongoose = require("mongoose")


const dnsSchema =
new mongoose.Schema({

hostname:{
    type:String,
    required:true,
    trim:true
},


domain:{
    type:String,
    required:true,
    unique:true,
    trim:true
},


target:{
    type:String,
    required:true,
    trim:true
},


type:{
    type:String,
    enum:[
        "A",
        "AAAA",
        "CNAME"
    ],
    default:"A"
},


proxy:{
    type:Boolean,
    default:false
},


owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},


createdBy:{

    username:{
        type:String
    },

    role:{
        type:String
    }

},


status:{
    type:String,
    enum:[
        "active",
        "deleted"
    ],
    default:"active"
}


},{
    timestamps:true
})



module.exports =
mongoose.model(
"DNS",
dnsSchema
)
