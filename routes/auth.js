const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, age, gender, mobile } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      password: encryptedPassword,
      age,
      gender,
      mobile,
    });
    res.json({
      status: "SUCCESS",
      data: "you have signed up  successfully",
    });
  } catch (error) {
    console.error("Error", error);
    res.json({
      status: "FAILED",
      message: "something went wrong",
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const PasswordMatched = await bcrypt.compare(password, user.password);
      if (PasswordMatched) {
        const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.json({
          status: "SUCCESS",
          message: "you have logged in successfully",
          jwtToken,
        });
      } else {
        res.json({
          status: "FAILED",
          message: "Incorrect email and password. Please try again",
        });
      }
    } else {
      res.json({
        status: "FAILED",
        message: "User does not exit",
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: "Incorrect email and password. Please try again",
    });
  }
});

module.exports = router;
