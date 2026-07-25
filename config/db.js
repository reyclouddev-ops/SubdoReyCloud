const mongoose = require("mongoose")


let connected = false


async function connectDB(){


if(connected){
    return
}


try{


await mongoose.connect(
process.env.MONGO_URI
)


connected = true


console.log(
"MongoDB Connected"
)



}catch(err){


console.log(
"MongoDB Error:",
err.message
)


throw err

}


}


module.exports = connectDB
