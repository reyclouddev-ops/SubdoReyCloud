const hostname = document.getElementById("hostname")
const preview = document.getElementById("preview")
const platform = document.getElementById("platform")
const extraField = document.getElementById("extraField")
const status = document.getElementById("status")
const checkBtn = document.getElementById("checkBtn")
const deployBtn = document.getElementById("deployBtn")

const DOMAIN = "legionteknologi.my.id"

// ===========================
// Preview Domain
// ===========================

hostname.addEventListener("input", () => {

const host =
hostname.value
.trim()
.toLowerCase()

preview.innerText =
host
? `${host}.${DOMAIN}`
: `hostname.${DOMAIN}`

deployBtn.disabled = true

status.className = ""

status.innerHTML =
"⚪ Belum Dicek"

})

// ===========================
// Platform Change
// ===========================

platform.addEventListener(
"change",
renderPlatform
)

renderPlatform()

function renderPlatform(){

const value =
platform.value

let html = ""

switch(value){

case "vercel":

html = `

<div class="status-box">

<h3>
🚀 Vercel Deploy
</h3>

<p>

ReyCloud akan otomatis membuat:

</p>

<br>

<b>
CNAME
</b>

<br>

<code>

cname.vercel-dns.com

</code>

<br><br>

<small>

Setelah DNS berhasil dibuat,
tambahkan

<b>${hostname.value || "hostname"}.${DOMAIN}</b>

ke Domain Project Vercel.

</small>

</div>

`

break


case "netlify":

html = `

<div class="input-group">

<label>

Netlify Site

</label>

<input
id="target"
placeholder="mysite.netlify.app">

</div>

`

break


case "github":

html = `

<div class="input-group">

<label>

GitHub Username

</label>

<input
id="target"
placeholder="username">

</div>

`

break


case "cloudflare":

html = `

<div class="input-group">

<label>

Project Pages

</label>

<input
id="target"
placeholder="myproject.pages.dev">

</div>

`

break


case "custom":

html = `

<div class="input-group">

<label>

Type

</label>

<select id="recordType">

<option>A</option>

<option>AAAA</option>

<option>CNAME</option>

<option>TXT</option>

</select>

</div>

<div class="input-group">

<label>

Target

</label>

<input
id="target"
placeholder="Isi Target">

</div>

`

break

}

extraField.innerHTML = html

}

// ===========================
// Check Hostname
// ===========================

checkBtn.onclick =
async()=>{

const host =
hostname.value
.trim()
.toLowerCase()

if(!host){

alert(
"Masukkan hostname."
)

return

}

status.className =
"status-loading"

status.innerHTML =

`<span class="loading"></span>
Checking...`

deployBtn.disabled = true

try{

const res =
await fetch(

`/api/dns/check?hostname=${host}`

)

const json =
await res.json()

if(json.available){

status.className =
"status-success"

status.innerHTML =
"🟢 Hostname tersedia"

deployBtn.disabled = false

}else{

status.className =
"status-error"

status.innerHTML =
"🔴 Hostname sudah digunakan"

}

}catch(err){

status.className =
"status-error"

status.innerHTML =
"❌ Gagal cek server"

}

}

// ===========================
// Deploy
// ===========================

deployBtn.onclick =
async()=>{

const host =
hostname.value
.trim()

const data = {

hostname:host,

platform:platform.value

}

const target =
document.getElementById("target")

if(target){

data.target =
target.value

}

const type =
document.getElementById("recordType")

if(type){

data.type =
type.value

}

deployBtn.disabled = true

deployBtn.innerHTML =
"⏳ Deploying..."

try{

const res =
await fetch(

"/api/dns/platform",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
"Bearer " +
localStorage.getItem("token")

},

body:
JSON.stringify(data)

}

)

const json =
await res.json()

if(!json.success){

alert(
json.message
)

deployBtn.disabled = false

deployBtn.innerHTML =
"🚀 Deploy"

return

}

alert(

"DNS berhasil dibuat!"

)

window.location.href =
"/history.html"

}catch(err){

alert(
"Gagal Deploy."
)

deployBtn.disabled = false

deployBtn.innerHTML =
"🚀 Deploy"

}

  }
