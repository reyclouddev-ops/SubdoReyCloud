const jwt = require("jsonwebtoken")


module.exports = (req,res,next)=>{


const header =
req.headers.authorization


if(!header)
return res.status(401).json({
    message:"Token diperlukan"
})


const token =
header.split(" ")[1]


try{


const decode =
jwt.verify(
    token,
    process.env.JWT_SECRET
)


req.user = decode


next()


}catch(err){


return res.status(401).json({
    message:"Token tidak valid"
})


}


}
