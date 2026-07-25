const mongoose = require("mongoose")


const UserSchema =
new mongoose.Schema({

username:{
    type:String,
    required:true
},


email:{
    type:String,
    required:true,
    unique:true
},


password:{
    type:String,
    required:true
},


role:{
    type:String,
    default:"User"
},


dnsUsed:{
    type:Number,
    default:0
},


lastReset:{
    type:Date,
    default:Date.now
}


},{
timestamps:true
})


module.exports =
mongoose.model(
"User",
UserSchema
)
