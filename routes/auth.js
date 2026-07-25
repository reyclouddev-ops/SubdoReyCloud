const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const router = express.Router()



// =======================
// REGISTER
// =======================

router.post("/register", async(req,res)=>{

try{


const {
username,
email,
password
}=req.body



if(
!username ||
!email ||
!password
){

return res.status(400).json({

success:false,

message:"Username, email, dan password wajib diisi"

})

}



const cleanEmail =
email.toLowerCase().trim()



// cek email

const exist =
await User.findOne({

email:cleanEmail

})



if(exist){

return res.status(400).json({

success:false,

message:"Email sudah digunakan"

})

}



// hash password

const hash =
await bcrypt.hash(
password,
10
)



const user =
new User({

username:username.trim(),

email:cleanEmail,

password:hash,

role:"User"

})



await user.save()



return res.json({

success:true,

message:"Register berhasil",

user:{

username:user.username,

email:user.email,

role:user.role

}

})



}catch(err){


console.log(
"REGISTER ERROR:",
err
)



return res.status(500).json({

success:false,

message:err.message

})


}


})





// =======================
// LOGIN
// =======================

router.post("/login", async(req,res)=>{


try{


const {
email,
password
}=req.body



if(
!email ||
!password
){

return res.status(400).json({

success:false,

message:"Email dan password wajib diisi"

})

}



const cleanEmail =
email.toLowerCase().trim()



const user =
await User.findOne({

email:cleanEmail

})



if(!user){

return res.status(404).json({

success:false,

message:"Akun tidak ditemukan"

})

}



const check =
await bcrypt.compare(

password,

user.password

)



if(!check){

return res.status(401).json({

success:false,

message:"Password salah"

})

}



let role =
user.role



// OWNER ENV

if(
cleanEmail ===
process.env.OWNER_EMAIL?.toLowerCase()
){

role="Owner"


if(user.role !== "Owner"){

user.role="Owner"

await user.save()

}

}




const token =
jwt.sign(

{

id:user._id,

username:user.username,

email:user.email,

role

},

process.env.JWT_SECRET,

{

expiresIn:"2y"

}

)




return res.json({

success:true,

message:"Login berhasil",

token,


profile:{

username:user.username,

email:user.email,

role

}

})


}catch(err){


console.log(
"LOGIN ERROR:",
err
)



return res.status(500).json({

success:false,

message:err.message

})


}


})



module.exports = router
