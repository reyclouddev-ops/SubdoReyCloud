module.exports = async(user)=>{


const now = Date.now()


// reset setelah 24 jam

if(
!user.resetLimitAt ||
now >= new Date(user.resetLimitAt)
){


user.dnsUsed = 0


user.resetLimitAt =
new Date(
now + 24 * 60 * 60 * 1000
)


await user.save()


}



// cek limit

if(
user.role === "User" &&
user.dnsUsed >= 5
){

return false

}


return true


}
