const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const ejs = require("ejs");

//EXPRESS APP
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//AUTHENTICATION
const loggedIn = (req, res, next) => {
  try {
    const { jwttoken } = req.headers;
    const user = jwt.verify(jwttoken, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.json({
      status: "Failed",
      message: "You have not loggedIn. Please loggedIn",
    });
  }
};

//AUTHORIZATION
const Premium = (req, res, next) => {
  if (req.user.isPremium) {
    next();
  } else {
    res.json({
      status: "FAILED",
      message: "You have not premium user .Please buy premium plan",
    });
  }
};

//USER SCHEMA
const User = mongoose.model("User", {
  fullName: {
    type: String,
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  mobile: {
    type: Number,
  },
});

//health API
app.get("/health", (req, res) => {
  const serverInfo = {
    serverName: "Week List Server",
    currentTime: new Date(),
    state: "active",
  };
  res.json(serverInfo);
});

//MIDDLEWARE
// app.use((req, res, next) => {
//   res.json({
//     status: 404,
//     error: "Route not found",
//   });
// });

app.get("/", (req, res) => {
  res.json({
    status: "SUCCESS",
    message: "All good",
  });
});

app.get("/dashboard", loggedIn, async (req, res) => {
  res.send("Welcome to Dashboard page");
});

app.get("/premium", loggedIn, Premium, async (req, res) => {
  res.send("Welcome to Premium page");
});

//SIGNUP
app.post("/signup", async (req, res) => {
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
    res.json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      let PasswordMatched = await bcrypt.compare(password, user.password);
      if (PasswordMatched) {
        const jwtToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: 10,
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

// app.set("view engine", ejs);

app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});
