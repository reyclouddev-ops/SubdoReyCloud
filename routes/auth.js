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
        } = req.body


        const check =
        await User.findOne({
            email
        })


        if(check)
        return res.status(400).json({
            message:"Email sudah terdaftar"
        })


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



const user =
await User.findOne({
    email
})


if(!user)
return res.status(404).json({
    message:"User tidak ditemukan"
})



const match =
await bcrypt.compare(
    password,
    user.password
)


if(!match)
return res.status(401).json({
    message:"Password salah"
})



// =======================
// OWNER CHECK ENV
// =======================

let role = user.role


if(
email === process.env.OWNER_EMAIL
){

    role="Owner"

}



// TOKEN

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
