const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth")

const DNS = require("../models/DNS")
const User = require("../models/User")

const checkLimit = require("../utils/limit")

const {
    createDNS,
    deleteDNS,
    updateProxy
} = require("../utils/cloudflare")

const MAIN_DOMAIN =
process.env.MAIN_DOMAIN ||
"legionteknologi.my.id"


// ======================
// CHECK HOSTNAME
// ======================

router.get(
"/check",
auth,
async(req,res)=>{

try{

const hostname =
(req.query.hostname || "")
.trim()
.toLowerCase()

if(!hostname){

return res.status(400).json({

success:false,

message:"Hostname kosong"

})

}

const panel =
`${hostname}.${MAIN_DOMAIN}`

const website =
`${hostname}.${MAIN_DOMAIN}`

const exists =
await DNS.findOne({

$or:[
{domain:panel},
{domain:website}
]

})

res.json({

success:true,

available:!exists

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})


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

}=req.body

const user =
await User.findById(req.user.id)

if(!user){

return res.status(404).json({

success:false,

message:"User tidak ditemukan"

})

}

const allowed =
await checkLimit(user)

if(!allowed){

return res.status(403).json({

success:false,

message:"Limit Create DNS habis"

})

}

let result = []

if(type==="panel"){

const panelDomain =
`panel.${hostname}.${MAIN_DOMAIN}`

const nodeDomain =
`node.${hostname}.${MAIN_DOMAIN}`


// PANEL

const panelDNS =
await createDNS({

name:panelDomain,

target,

proxied:
proxied ?? false

})


// NODE

const nodeDNS =
await createDNS({

name:nodeDomain,

target,

proxied:
proxied ?? false

})

await DNS.create({

hostname:`panel.${hostname}`,

domain:panelDomain,

target,

type:panelDNS.type,

proxy:panelDNS.proxied,

recordId:panelDNS.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})

await DNS.create({

hostname:`node.${hostname}`,

domain:nodeDomain,

target,

type:nodeDNS.type,

proxy:nodeDNS.proxied,

recordId:nodeDNS.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})

result={

panel:panelDomain,

node:nodeDomain,

record:panelDNS.type,

target,

proxy:
panelDNS.proxied?"ON":"OFF"

}

}else{

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

type:cloudflare.type,

proxy:cloudflare.proxied,

recordId:cloudflare.id,

owner:user._id,

createdBy:{

username:user.username,

role:user.role

}

})

result={

domain,

record:cloudflare.type,

target,

proxy:
cloudflare.proxied?"ON":"OFF"

}

}

if(user.role==="User"){

user.dnsUsed+=1

await user.save()

}

res.json({

success:true,

creator:user.username,

role:user.role,

result

})

}catch(err){

console.log(err)

res.status(500).json({

success:false,

message:err.message

})

}

})
// ======================
// UPDATE PROXY
// ======================

router.put(
"/proxy/:id",
auth,
async(req,res)=>{

try{

const dns =
await DNS.findById(req.params.id)

if(!dns){

return res.status(404).json({

success:false,

message:"DNS tidak ditemukan"

})

}

const status =
req.body.proxied

await updateProxy(

dns.recordId,

status

)

dns.proxy = status

await dns.save()

res.json({

success:true,

message:"Proxy berhasil diubah",

proxy:status

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})


// ======================
// DELETE DNS
// ======================

router.delete(
"/delete/:id",
auth,
async(req,res)=>{

try{

const dns =
await DNS.findById(req.params.id)

if(!dns){

return res.status(404).json({

success:false,

message:"DNS tidak ditemukan"

})

}

await deleteDNS(

dns.recordId

)

await DNS.deleteOne({

_id:dns._id

})

res.json({

success:true,

message:"DNS berhasil dihapus"

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})


// ======================
// LIST DNS
// ======================

router.get(
"/list",
auth,
async(req,res)=>{

try{

const user =
await User.findById(req.user.id)

let data

if(

user.role==="Owner" ||

user.role==="Admin"

){

data =
await DNS.find()

.populate(

"owner",

"username email role"

)

.sort({

createdAt:-1

})

}else{

data =
await DNS.find({

owner:user._id

})

.sort({

createdAt:-1

})

}

res.json({

success:true,

total:data.length,

data

})

}catch(err){

res.status(500).json({

success:false,

message:err.message

})

}

})


// ======================
// EXPORT
// ======================

module.exports = router
