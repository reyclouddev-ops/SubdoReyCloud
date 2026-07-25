const token =
localStorage.getItem("token")



async function createAdmin(){


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

"/api/admin/create-admin",

{

method:"POST",

headers:{

"Content-Type":
"application/json",

Authorization:
"Bearer "+token

},

body:
JSON.stringify(data)

}

)


const json =
await res.json()



result.innerHTML =
json.message


}
