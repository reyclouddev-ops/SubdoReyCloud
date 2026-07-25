const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("../config/db")

const authRoute = require("../routes/auth")
const dnsRoute = require("../routes/dns")


const app = express()


app.use(cors())

app.use(express.json())


connectDB()


app.get("/api", (req,res)=>{
    res.json({
        success:true,
        name:"ReyCloud Cloud Manager"
    })
})


app.use("/api/auth", authRoute)

app.use("/api/dns", dnsRoute)


module.exports = app
