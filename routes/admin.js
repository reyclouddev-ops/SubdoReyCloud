const express = require("express")
const bcrypt = require("bcryptjs")

const router = express.Router()

const auth =
require("../middleware/auth")

const role =
require("../middleware/role")

const User =
require("../models/User")



// ======================
// CREATE ADMIN
// OWNER ONLY
// ======================

router.post(
"/create-admin",
auth,
role("Owner"),
async(req,res)=>{


try{


const {
username,
email,
password
}=req.body



const hash =
await bcrypt.hash(
password,
10
)



const user =
await User.create({

username,

email,

password:hash,

role:"Admin"

})



res.json({

success:true,

message:"Admin berhasil dibuat",

user:{
username:user.username,
role:user.role
}

})


}catch(err){


res.status(500).json({

message:err.message

})


}


})




// ======================
// CREATE RESELLER
// OWNER + ADMIN
// ======================


router.post(
"/create-reseller",
auth,
role(
"Owner",
"Admin"
),
async(req,res)=>{


try{


const {
username,
email,
password
}=req.body



const hash =
await bcrypt.hash(
password,
10
)



const user =
await User.create({

username,

email,

password:hash,

role:"Reseller"

})



res.json({

success:true,

message:"Reseller berhasil dibuat",

user:{
username:user.username,
role:user.role
}

})


}catch(err){


res.status(500).json({

message:err.message

})


}


})





// ======================
// LIST USER
// ======================


router.get(
"/users",
auth,
role(
"Owner",
"Admin"
),
async(req,res)=>{


const users =
await User.find()
.select("-password")



res.json({

success:true,

data:users

})


})




module.exports = router
