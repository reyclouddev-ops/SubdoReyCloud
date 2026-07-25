const profile =
JSON.parse(
localStorage.getItem("profile")
)


if(!profile){

location.href="login.html"

}



username.innerHTML =
profile.username


role.innerHTML =
profile.role



function logout(){

localStorage.clear()

location.href="login.html"

}
