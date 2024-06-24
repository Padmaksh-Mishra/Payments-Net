const {JWT_SECRET} = require("./secret")
const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            message: "Badly formated authHeader"
        })
    }
    
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        if(decoded.userID){
            req.userID = decoded.userID;
            next();
        }else{
            res.status(403).json({
                message: "Decoded token did not give userID"
            });
        }

    }catch(error){
        return res.status(403).json({
            message : "Verification of token failed ",
            error : error.errors
        })
    }

};

module.exports = {
    authMiddleware,
}