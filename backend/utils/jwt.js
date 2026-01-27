const jwt = require("jsonwebtoken");
const SECRET = "secret5678";

module.exports.createToken = (payload)=>{
    return jwt.sign(payload, SECRET, {expiresIn:"1d"});
};

module.exports.verifyToken = (token) =>{
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
}