const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("../config/db")

const authRoute = require("../routes/auth")
const dnsRoute = require("../routes/dns")
const adminRoute = require("../routes/admin")


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


app.use("/api/auth", authRoute)

app.use("/api/dns", dnsRoute)

app.use("/api/admin",adminRoute)

router.get(
"/stats",
auth,
role(
"Owner",
"Admin"
),
async(req,res)=>{


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


})


module.exports = app
