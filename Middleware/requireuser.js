const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {error,success} = require(
  "../Utils/Request"
);
const User =require("../MOdel/User")
module.exports = async (req, res, next) => {
  try {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.send(error(401, "Authorization header is required"));
    }
    
    const accessToken = req.headers.authorization.split(" ")[1];
    //  const aman= crypto.randomBytes(64).toString('hex');
    // console.log(aman);
    const matched = jwt.verify(accessToken, "khdfkhdskhdnkdnfkhdhkafhidfh");
    req._id = matched._id;
    // console.log(matched);
    const user = await User.findById(req._id);
    if(!user) {
        return res.send(error(404, 'User not found'));
    } 
    next();
  } catch (e) {
    return res.send(error(401, 'Invalid access key'))
    console.log(e.message);
  }
};
