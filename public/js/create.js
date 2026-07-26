const API = "/api/dns/create"

const btn =
document.getElementById("createBtn")

async function createDNS(){

const token =
localStorage.getItem("token")

if(!token){

location.href="login.html"

return

}

const type =
document.getElementById("type").value

const hostname =
document.getElementById("hostname")
.value
.trim()
.toLowerCase()

const target =
document.getElementById("target")
.value
.trim()

const proxied =
document.getElementById("proxy")
.value==="true"

if(!hostname){

alert("Masukkan hostname.")

return

}

if(!target){

alert("Masukkan target.")

return

}

btn.disabled=true

btn.innerHTML="⏳ Creating..."

const data={

type,

hostname,

target,

proxied

}

try{

const res =
await fetch(API,{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:
"Bearer "+token

},

body:
JSON.stringify(data)

})

const json =
await res.json()

const result =
document.getElementById("result")

if(!json.success){

result.innerHTML=`

<div class="user-box">

<h3>

❌ Gagal

</h3>

<p>

${json.message}

</p>

</div>

`

btn.disabled=false

btn.innerHTML="🚀 Create DNS"

return

}

let html=`

<div class="user-box">

<h3>

✅ DNS Berhasil

</h3>

<hr>

`

if(type==="panel"){

html+=`

<b>

🖥 Panel

</b>

<br>

${json.result.panel}

<br><br>

<b>

🌐 Node

</b>

<br>

${json.result.node}

<br><br>

`

}else{

html+=`

<b>

🌐 Domain

</b>

<br>

${json.result.domain}

<br><br>

`

}

html+=`

<b>

📄 Record

</b>

<br>

${json.result.record}

<br><br>

<b>

🎯 Target

</b>

<br>

${json.result.target}

<br><br>

<b>

☁ Proxy

</b>

<br>

${json.result.proxy}

<br><br>

<button onclick="copyDomain('${
type==="panel"
?json.result.panel
:json.result.domain
}')">

📋 Copy Domain

</button>

</div>

`

result.innerHTML=html

}catch(err){

document.getElementById("result").innerHTML=`

<div class="user-box">

<h3>

❌ Error

</h3>

<p>

${err.message}

</p>

</div>

`

}

btn.disabled=false

btn.innerHTML="🚀 Create DNS"

}

btn.onclick=createDNS

function copyDomain(domain){

navigator.clipboard.writeText(domain)

alert("Domain berhasil disalin.")

}
