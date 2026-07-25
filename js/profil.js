const profile =
JSON.parse(
localStorage.getItem("profile")
)


if(!profile){

location.href="login.html"

}



document.getElementById(
"name"
).innerHTML =
"Username : "+profile.username



document.getElementById(
"role"
).innerHTML =
"Role : "+profile.role




function logout(){

localStorage.clear()

location.href="login.html"

}
