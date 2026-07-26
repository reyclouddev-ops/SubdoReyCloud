const profile = JSON.parse(
    localStorage.getItem("profile")
)

if (!profile) {
    location.href = "login.html"
}

document.getElementById("username").innerText =
    profile.username

document.getElementById("role").innerText =
    profile.role

const menu =
document.getElementById("menu")

// =====================
// OWNER
// =====================

if (profile.role === "Owner") {

    menu.innerHTML = `

<button onclick="location.href='create-dns.html'">
🖥️ DNS Manual
</button>

<button onclick="location.href='create-dns-new.html'">
🚀 Deploy Platform
</button>

<button onclick="location.href='mydns.html'">
🌐 All DNS
</button>

<button onclick="location.href='users.html'">
👥 User Management
</button>

<button onclick="location.href='create-admin.html'">
🛡️ Create Admin
</button>

<button onclick="location.href='create-reseller.html'">
🤝 Create Reseller
</button>

<button onclick="location.href='settings.html'">
⚙️ Settings
</button>

`

}

// =====================
// ADMIN
// =====================

else if (profile.role === "Admin") {

    menu.innerHTML = `

<button onclick="location.href='create-dns.html'">
🖥️ DNS Manual
</button>

<button onclick="location.href='create-dns-new.html'">
🚀 Deploy Platform
</button>

<button onclick="location.href='mydns.html'">
🌐 Manage DNS
</button>

<button onclick="location.href='users.html'">
👥 Users
</button>

<button onclick="location.href='create-reseller.html'">
🤝 Create Reseller
</button>

`

}

// =====================
// RESELLER
// =====================

else if (profile.role === "Reseller") {

    menu.innerHTML = `

<button onclick="location.href='create-dns.html'">
🖥️ DNS Manual
</button>

<button onclick="location.href='create-dns-new.html'">
🚀 Deploy Platform
</button>

<button onclick="location.href='mydns.html'">
🌐 My DNS
</button>

<button onclick="location.href='profile.html'">
👤 Profile
</button>

`

}

// =====================
// USER
// =====================

else {

    menu.innerHTML = `

<button onclick="location.href='create-dns.html'">
🖥️ DNS Manual
</button>

<button onclick="location.href='create-dns-new.html'">
🚀 Deploy Platform
</button>

<button onclick="location.href='mydns.html'">
🌐 My DNS
</button>

<button onclick="location.href='profile.html'">
👤 Profile
</button>

`

}

// =====================
// LOGOUT
// =====================

function logout() {

    if (!confirm("Yakin ingin logout?")) return

    localStorage.clear()

    location.href = "login.html"

}
