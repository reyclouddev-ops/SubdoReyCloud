const mongoose = require("mongoose")


const dnsSchema =
new mongoose.Schema({

hostname:{
    type:String,
    required:true
},


domain:{
    type:String,
    required:true
},


target:{
    type:String,
    required:true
},


type:{
    type:String,
    default:"A"
},


proxy:{
    type:Boolean,
    default:false
},


owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},


createdBy:{
    username:String,
    role:String
},


status:{
    type:String,
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
