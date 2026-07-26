const hostname = document.getElementById("hostname")
const preview = document.getElementById("preview")
const platform = document.getElementById("platform")
const extraField = document.getElementById("extraField")
const status = document.getElementById("status")
const checkBtn = document.getElementById("checkBtn")
const deployBtn = document.getElementById("deployBtn")

const DOMAIN = "legionteknologi.my.id"

// ==========================
// UPDATE PREVIEW
// ==========================

function updatePreview() {

    const host =
        hostname.value
            .trim()
            .toLowerCase()

    preview.innerHTML =
        host
            ? `${host}.${DOMAIN}`
            : `${hostname.placeholder}.${DOMAIN}`

    if (platform.value === "vercel") {
        renderPlatform()
    }

}

hostname.addEventListener(
    "input",
    updatePreview
)

updatePreview()

// ==========================
// PLATFORM
// ==========================

platform.addEventListener(
    "change",
    renderPlatform
)

renderPlatform()

function renderPlatform() {

    const host =
        hostname.value.trim() ||
        hostname.placeholder

    switch (platform.value) {

        case "vercel":

            extraField.innerHTML = `

<div class="status-box">

<h3>
🚀 Vercel Deploy
</h3>

<p>

ReyCloud akan otomatis membuat
record berikut:

</p>

<br>

<b>CNAME</b>

<br>

<code>

cname.vercel-dns.com

</code>

<br><br>

<small>

Tambahkan domain berikut
ke Project Vercel:

</small>

<br><br>

<b>

${host}.${DOMAIN}

</b>

</div>

`

            break

        case "netlify":

            extraField.innerHTML = `

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

            extraField.innerHTML = `

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

            extraField.innerHTML = `

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

            extraField.innerHTML = `

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

}

// ==========================
// CHECK HOSTNAME
// ==========================

checkBtn.onclick = async () => {

    const host =
        hostname.value
            .trim()
            .toLowerCase()

    if (!host) {

        alert("Masukkan hostname.")

        hostname.focus()

        return

    }

    status.className = "status-loading"

    status.innerHTML = `
<span class="loading"></span>
Checking hostname...
`

    preview.innerHTML =
        `🌐 ${host}.${DOMAIN}`

    deployBtn.disabled = true

    try {

        const res =
            await fetch(
                `/api/dns/check?hostname=${encodeURIComponent(host)}`
            )

        const json =
            await res.json()

        if (!res.ok) {

            throw new Error(
                json.message || "Server Error"
            )

        }

        if (json.available) {

            status.className =
                "status-success"

            status.innerHTML = `
✅ ${host}.${DOMAIN}
tersedia
`

            preview.innerHTML = `
🟢 ${host}.${DOMAIN}
`

            deployBtn.disabled = false

        } else {

            status.className =
                "status-error"

            status.innerHTML = `
❌ ${host}.${DOMAIN}
sudah digunakan
`

            preview.innerHTML = `
🔴 ${host}.${DOMAIN}
`

            deployBtn.disabled = true

        }

    } catch (err) {

        status.className =
            "status-error"

        status.innerHTML = `
❌ ${err.message}
`

        deployBtn.disabled = true

    }

}
// ==========================
// DEPLOY
// ==========================

deployBtn.onclick = async () => {

    const token =
        localStorage.getItem("token")

    if (!token) {

        location.href = "login.html"

        return

    }

    const host =
        hostname.value
            .trim()
            .toLowerCase()

    if (!host) {

        alert("Masukkan hostname.")

        return

    }

    const data = {

        hostname: host,

        platform: platform.value

    }

    // =====================
    // TARGET
    // =====================

    const target =
        document.getElementById("target")

    if (target) {

        if (!target.value.trim()) {

            alert("Target wajib diisi.")

            return

        }

        data.target =
            target.value.trim()

    }

    // =====================
    // CUSTOM TYPE
    // =====================

    const recordType =
        document.getElementById("recordType")

    if (recordType) {

        data.type =
            recordType.value

    }

    deployBtn.disabled = true

    deployBtn.innerHTML =
        "⏳ Deploying..."

    try {

        const res =
            await fetch(
                "/api/dns/platform",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            "Bearer " + token

                    },

                    body:
                        JSON.stringify(data)

                }
            )

        const json =
            await res.json()

        if (!res.ok || !json.success) {

            throw new Error(
                json.message ||
                "Deploy gagal."
            )

        }

        // =====================
        // SIMPAN HISTORY
        // =====================

        const history = {

            hostname: host,

            domain:
                `${host}.${DOMAIN}`,

            platform:
                platform.value,

            target:
                data.target ||
                "cname.vercel-dns.com",

            createdAt:
                new Date().toLocaleString("id-ID")

        }

        localStorage.setItem(
            "deploySuccess",
            JSON.stringify(history)
        )

        // =====================
        // REDIRECT
        // =====================

        window.location.href =
            "/deploy-success.html"

    } catch (err) {

        status.className =
            "status-error"

        status.innerHTML =
            `❌ ${err.message}`

        deployBtn.disabled = false

        deployBtn.innerHTML =
            "🚀 Deploy"

    }

}
