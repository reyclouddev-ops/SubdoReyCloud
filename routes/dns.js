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

const {
    createDNS
} = require("../utils/cloudflare")


const MAIN_DOMAIN =
process.env.MAIN_DOMAIN ||
"legionteknologi.my.id"



// ======================
// CREATE DNS
// ======================

router.post(
"/create",
auth,
async(req,res)=>{


try{


const {
    hostname,
    target,
    type,
    proxied
} = req.body



const user =
await User.findById(
    req.user.id
)



if(!user)
return res.status(404).json({
    message:"User tidak ditemukan"
})



// cek limit user free

const allowed =
await checkLimit(user)



if(!allowed)

return res.status(403).json({

message:
"Limit create DNS habis, tunggu reset 24 jam"

})



let result = []



// ======================
// PANEL + NODE
// ======================

if(type === "panel"){



const panelDomain =
`${hostname}.${MAIN_DOMAIN}`


const nodeDomain =
`node-${hostname}.${MAIN_DOMAIN}`



// CREATE CLOUDFLARE

const panelDNS =
await createDNS({

name:panelDomain,

target,

proxied:
proxied ?? false

})


const nodeDNS =
await createDNS({

name:nodeDomain,

target,

proxied:
proxied ?? false

})




// SIMPAN PANEL

await DNS.create({

hostname:
`${hostname}`,

domain:
panelDomain,

target,

type:
panelDNS.type,

proxy:
panelDNS.proxied,

recordId:
panelDNS.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})




// SIMPAN NODE

await DNS.create({

hostname:
`node-${hostname}`,

domain:
nodeDomain,

target,

type:
nodeDNS.type,

proxy:
nodeDNS.proxied,

recordId:
nodeDNS.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})


result.push({

panel:
panelDomain,

node:
nodeDomain

})



}else{



// ======================
// SINGLE DNS
// ======================


const domain =
`${hostname}.${MAIN_DOMAIN}`



const cloudflare =
await createDNS({

name:domain,

target,

proxied:
proxied ?? false

})



await DNS.create({

hostname,

domain,

target,

type:
cloudflare.type,

proxy:
cloudflare.proxied,

recordId:
cloudflare.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})


result.push(domain)


}




// tambah limit user

if(user.role === "User"){

user.dnsUsed += 1

await user.save()

}




res.json({

success:true,

message:
"SUBDOMAIN CONFIG SUCCESS",

creator:
user.username,

role:
user.role,

result

})



}catch(err){


console.log(err)


res.status(500).json({

success:false,

message:
err.message

})


}


})


module.exports = router
