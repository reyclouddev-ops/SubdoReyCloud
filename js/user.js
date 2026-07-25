const token =
localStorage.getItem("token")



async function loadUsers(){


const res =
await fetch(

"/api/admin/users",

{

headers:{

Authorization:
"Bearer "+token

}

}

)



const json =
await res.json()



const box =
document.getElementById(
"users"
)



box.innerHTML=""



json.data.forEach(user=>{


box.innerHTML += `

<div class="user-box">


<h3>
${user.username}
</h3>


<p>
Email:
${user.email}
</p>


<p>
Role:
${user.role}
</p>


<p>
DNS Used:
${user.dnsUsed}
</p>


</div>

`

})


}


loadUsers()
