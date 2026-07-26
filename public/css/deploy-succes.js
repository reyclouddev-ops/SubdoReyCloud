const data = JSON.parse(
localStorage.getItem("deploySuccess")
)

if(!data){

window.location.href="/dashboard.html"

}

// =========================
// ELEMENT
// =========================

const domain =
document.getElementById("domain")

const platform =
document.getElementById("platform")

const guide =
document.getElementById("guide")

const copyBtn =
document.getElementById("copyBtn")

const openBtn =
document.getElementById("openBtn")

// =========================
// DOMAIN
// =========================

domain.innerText =
data.domain

platform.innerText =
data.platform

// =========================
// GUIDE
// =========================

switch(data.platform){

case "vercel":

guide.innerHTML=`

1. Login ke Vercel

<br>

2. Pilih Project

<br>

3. Settings

<br>

4. Domains

<br>

5. Tambahkan

<b>

${data.domain}

</b>

`

break

case "netlify":

guide.innerHTML=`

1. Login ke Netlify

<br>

2. Site Settings

<br>

3. Domain Management

<br>

4. Tambahkan

<b>

${data.domain}

</b>

`

break

case "github":

guide.innerHTML=`

1. Login GitHub

<br>

2. Repository

<br>

3. Settings

<br>

4. Pages

<br>

5. Custom Domain

<br>

<b>

${data.domain}

</b>

`

break

case "cloudflare":

guide.innerHTML=`

1. Login Cloudflare

<br>

2. Pages

<br>

3. Custom Domains

<br>

4. Tambahkan

<b>

${data.domain}

</b>

`

break

default:

guide.innerHTML=`

DNS berhasil dibuat.

`

}

// =========================
// COPY
// =========================

copyBtn.onclick=()=>{

navigator.clipboard.writeText(
data.domain
)

copyBtn.innerHTML="✅ Copied"

setTimeout(()=>{

copyBtn.innerHTML="📋 Copy Domain"

},2000)

}

// =========================
// OPEN PLATFORM
// =========================

openBtn.onclick=()=>{

switch(data.platform){

case "vercel":

window.open(
"https://vercel.com/dashboard",
"_blank"
)

break

case "netlify":

window.open(
"https://app.netlify.com",
"_blank"
)

break

case "github":

window.open(
"https://github.com",
"_blank"
)

break

case "cloudflare":

window.open(
"https://dash.cloudflare.com",
"_blank"
)

break

default:

alert(
"Platform tidak tersedia."
)

}

}

// =========================
// CLEAR DATA
// =========================

window.addEventListener(
"beforeunload",
()=>{

localStorage.removeItem(
"deploySuccess"
)

}
)
