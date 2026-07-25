const token =
localStorage.getItem("token")



async function loadDNS(){


const res =
await fetch(

"/api/dns/list",

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
"list"
)



box.innerHTML=""



json.data.forEach(dns=>{


box.innerHTML += `

<div class="dns-box">


<h3>
${dns.domain}
</h3>


<p>
Type:
${dns.type}
</p>


<p>
Target:
${dns.target}
</p>


<p>
Proxy:
${dns.proxy ? "🟠 ON":"⚪ OFF"}
</p>


<button onclick="removeDNS('${dns._id}')">
Delete
</button>


<button onclick="toggleProxy('${dns._id}', ${!dns.proxy})">

Toggle Proxy

</button>


</div>

`

})


}



async function removeDNS(id){


await fetch(

"/api/dns/delete/"+id,

{

method:"DELETE",

headers:{

Authorization:
"Bearer "+token

}

}

)


loadDNS()


}



async function toggleProxy(id,status){


await fetch(

"/api/dns/proxy/"+id,

{

method:"PUT",

headers:{

"Content-Type":
"application/json",

Authorization:
"Bearer "+token

},


body:

JSON.stringify({

proxied:status

})

}


)


loadDNS()


}



loadDNS()
