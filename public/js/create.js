const API =
"/api/dns/create"



async function createDNS(){


const token =
localStorage.getItem("token")



if(!token){

location.href =
"login.html"

}



const data = {


hostname:
document.getElementById(
"hostname"
).value,


target:
document.getElementById(
"target"
).value,


type:
document.getElementById(
"type"
).value,


proxied:
document.getElementById(
"proxy"
).value === "true"


}



const res =
await fetch(

API,

{

method:"POST",


headers:{


"Content-Type":
"application/json",


"Authorization":
"Bearer "+token


},


body:
JSON.stringify(data)


}

)



const json =
await res.json()



const box =
document.getElementById(
"result"
)



if(json.success){


let output = `

<h3>
✅ SUBDOMAIN CONFIG SUCCESS
</h3>


<hr>


<b>Creator:</b>
${json.creator}


<br>


<b>Role:</b>
${json.role}


<br><br>

`



json.result.forEach(item=>{


if(typeof item === "object"){


output += `

<b>🌐 Panel</b>
<br>

${item.panel}

<br><br>


<b>🌐 Node</b>
<br>

${item.node}

<br>


`

}else{


output += `

<b>🌐 Domain</b>
<br>

${item}

<br>

`

}


})



box.innerHTML =
output



}else{


box.innerHTML = `

❌ ${json.message}

`


}



}
