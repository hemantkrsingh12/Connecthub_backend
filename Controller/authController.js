const User = require("../MOdel/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { param } = require("../Routes/authRouter");
const { success, error } = require("../Utils/Request");
const signupcontroller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (email.endsWith("@gmail.com")) {
      if (!email || !password || !name) {
        res.send(error(400, "All field are required"));
        return;
      }
      const olduser = await User.findOne({ email });
      if (olduser) {
        return res.send(error(409, "User already exists"));
      }
      const hashpassword = await bcrypt.hash(password, 10);
      const data = await User.create({
        name,
        email,
        password: hashpassword,
      });
      res.send(success(201, "User Created succesfully"));
    } else {
      return res.send(error(401, "Add @gmail.com at the end"));
    }
  } catch (e) {
    res.send(error(500, e.message));
    console.log(e.message);
  }
};

const refreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies) {
      return res.send(error(401, "refresh Token in the cookies required"));
    }
    const refreshToken = cookies.jwt;
    const decoded = jwt.verify(refreshToken, "ksdhkdvkvdpoiowrtuorknbnz");
    const _id = decoded._id;
    const accessToken = generateAcessToken({ _id });
    return res.send(success(201, { accessToken }));
  } catch (e) {
    // return res.send(error(401, "Invalid refresh token"));
    return res.send(error(401, "Invalid refresh token"));
  }
};

const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send(error(404, "user is not registered"));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.send(error(403, "Incorrect password"));
    }
    const accessToken = generateAcessToken({
      _id: user._id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({ _id: user._id });

    res.cookie("jwt", refreshToken, {
      httponly: true,
      server: true,
    });

    res.send(success(200, { accessToken , message: "User logged in successfully"}));
  } catch (e) {
    res.send(error(500, e.message));
    console.log(e);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httponly: true,
      secure: true,
    });
    return res.send(success(200, "User logout successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
const generateRefreshToken = (data) => {
  const refreshToken = jwt.sign(data, "ksdhkdvkvdpoiowrtuorknbnz", {
    expiresIn: "1d",
  });
  return refreshToken;
};
const generateAcessToken = (data) => {
  const token = jwt.sign(data, "khdfkhdskhdnkdnfkhdhkafhidfh", {
    expiresIn: "15m",
  });
  return token;
};

module.exports = { signupcontroller, logincontroller, refreshToken, logout };
