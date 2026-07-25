const axios = require("axios")


const cf = axios.create({

    baseURL:
    "https://api.cloudflare.com/client/v4",

    headers:{
        Authorization:
        `Bearer ${process.env.CF_API_TOKEN}`,

        "Content-Type":
        "application/json"
    }

})


// Detect DNS Type

function detectType(target){

    // IPv4
    if(
        /^\d+\.\d+\.\d+\.\d+$/.test(target)
    ){
        return "A"
    }


    // IPv6
    if(
        target.includes(":")
    ){
        return "AAAA"
    }


    // domain
    return "CNAME"

}



// Create DNS

async function createDNS({

name,
target,
proxied=true

}){


const type =
detectType(target)



const response =
await cf.post(

`/zones/${process.env.CF_ZONE_ID}/dns_records`,

{

type,

name,

content:target,

ttl:1,

proxied

}

)



return {

id:
response.data.result.id,

type,

name,

target,

proxied

}


}



// DELETE DNS

async function deleteDNS(id){


return await cf.delete(

`/zones/${process.env.CF_ZONE_ID}/dns_records/${id}`

)


}



// UPDATE PROXY

async function updateProxy(
id,
proxied
){


return await cf.patch(

`/zones/${process.env.CF_ZONE_ID}/dns_records/${id}`,

{

proxied

}

)


}



module.exports = {

createDNS,

detectType,

deleteDNS,

updateProxy

}
