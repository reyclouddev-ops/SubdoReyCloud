const API =
"/api/auth"



async function register(){


const data={

username:
username.value,

email:
email.value,

password:
password.value

}


const res =
await fetch(
API+"/register",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(data)

})


const json =
await res.json()


alert(json.message)


}



async function login(){


const data={

email:
email.value,

password:
password.value

}



const res =
await fetch(

API+"/login",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(data)

}

)



const json =
await res.json()



if(json.token){


localStorage.setItem(
"token",
json.token
)


localStorage.setItem(
"profile",
JSON.stringify(
json.profile
)
)



location.href =
"dashboard.html"



}else{


alert(json.message)


}


}
