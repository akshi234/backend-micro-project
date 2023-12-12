const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = (req, res, next) => {
  try {
    const { jwttoken } = req.headers;
    const user = jwt.verify(jwttoken, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.json({
      status: "Failed",
      message: "You have not loggedIn. Please re-login",
    });
  }
};

module.exports = authenticate;
