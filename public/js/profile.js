const profile = JSON.parse(
    localStorage.getItem("profile")
)

if (!profile) {
    location.href = "login.html"
}

document.getElementById("username").innerText =
    profile.username || "-"

document.getElementById("email").innerText =
    profile.email || "-"

document.getElementById("role").innerText =
    profile.role || "-"

document.getElementById("password").innerText =
    "********"

function logout() {

    if (!confirm("Yakin ingin logout?")) return

    localStorage.clear()

    location.href = "login.html"

}
