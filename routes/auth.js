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

message:"Data tidak lengkap"

})

}



const cleanEmail =
email.toLowerCase()



const check =
await User.findOne({

email:cleanEmail

})



if(check){

return res.status(400).json({

message:"Email sudah terdaftar"

})

}



const hash =
await bcrypt.hash(
password,
10
)



const user =
await User.create({

username,

email:cleanEmail,

password:hash,

role:"User"

})



res.json({

success:true,

message:"Register berhasil",

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





// =======================
// LOGIN
// =======================

router.post("/login", async(req,res)=>{


try{


const {
email,
password
}=req.body



const cleanEmail =
email.toLowerCase()



const user =
await User.findOne({

email:cleanEmail

})



if(!user){

return res.status(404).json({

message:"User tidak ditemukan"

})

}



const match =
await bcrypt.compare(

password,

user.password

)



if(!match){

return res.status(401).json({

message:"Password salah"

})

}



let role =
user.role



// =======================
// OWNER CHECK ENV
// =======================

if(
cleanEmail ===
process.env.OWNER_EMAIL
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




res.json({

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


res.status(500).json({

message:err.message

})


}


})



module.exports = router
