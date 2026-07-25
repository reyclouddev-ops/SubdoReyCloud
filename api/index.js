const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("../config/db")

const authRoute = require("../routes/auth")
const dnsRoute = require("../routes/dns")
const adminRoute = require("../routes/admin")

const auth =
require("../middleware/auth")

const role =
require("../middleware/role")

const User =
require("../models/User")

const DNS =
require("../models/DNS")


const app = express()


app.use(cors())

app.use(express.json())



connectDB()



app.get("/api", (req,res)=>{

res.json({

success:true,

name:"ReyCloud Manager"

})

})



// AUTH

app.use(
"/api/auth",
authRoute
)



// DNS

app.use(
"/api/dns",
dnsRoute
)



// ADMIN

app.use(
"/api/admin",
adminRoute
)




// ======================
// STATISTIC
// ======================

app.get(
"/api/stats",
auth,
role(
"Owner",
"Admin"
),

async(req,res)=>{


try{


const totalUser =
await User.countDocuments()



const totalDNS =
await DNS.countDocuments()



const admin =
await User.countDocuments({

role:"Admin"

})



const reseller =
await User.countDocuments({

role:"Reseller"

})



res.json({

success:true,

stats:{

user:totalUser,

dns:totalDNS,

admin,

reseller

}

})



}catch(err){


res.status(500).json({

success:false,

message:err.message

})


}


})



module.exports = app
