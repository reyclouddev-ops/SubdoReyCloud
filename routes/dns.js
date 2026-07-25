const express = require("express")

const router = express.Router()

const auth =
require("../middleware/auth")

const DNS =
require("../models/DNS")

const User =
require("../models/User")

const checkLimit =
require("../utils/limit")



const MAIN_DOMAIN =
process.env.MAIN_DOMAIN ||
"legionteknologi.my.id"



// CREATE DNS

router.post(
"/create",
auth,
async(req,res)=>{


try{


const {
hostname,
target,
type
}=req.body



const user =
await User.findById(
req.user.id
)



// cek limit

const allowed =
await checkLimit(user)



if(!allowed)
return res.status(403).json({

message:
"Limit create DNS habis, tunggu reset 24 jam"

})



// =================
// PANEL TYPE
// =================

let result = []



if(type === "panel"){


const panel =
`${hostname}.${MAIN_DOMAIN}`


const node =
`node-${hostname}.${MAIN_DOMAIN}`



result.push(panel)
result.push(node)



await DNS.create({

hostname:`${hostname}`,

domain:panel,

target,

type:"A",

proxy:false,

owner:user._id,

createdBy:{
username:user.username,
role:user.role
}

})



await DNS.create({

hostname:`node-${hostname}`,

domain:node,

target,

type:"A",

proxy:false,

owner:user._id,

createdBy:{
username:user.username,
role:user.role
}

})



}else{



const domain =
`${hostname}.${MAIN_DOMAIN}`



result.push(domain)



await DNS.create({

hostname,

domain,

target,

type:type || "A",

proxy:false,

owner:user._id,

createdBy:{
username:user.username,
role:user.role
}

})



}



// tambah penggunaan

if(user.role === "User"){

user.dnsUsed += 1

await user.save()

}



res.json({

success:true,

message:"DNS berhasil dibuat",

result

})


}catch(err){


res.status(500).json({

message:err.message

})


}


})


module.exports = router
