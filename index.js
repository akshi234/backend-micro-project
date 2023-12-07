const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//EXPRESS APP
const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//health API
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "Weeklist Server",
    time: new Date(),
    status: "active",
  });
});

//MIDDLEWARE
// app.use((req, res, next) => {
//   res.json({
//     status: 404,
//     error: "Route not found",
//   });
// });

// app.get("/", (req, res) => {
//   res.json({
//     status: "SUCCESS",
//     message: "All good",
//   });
// });

// app.get("/dashboard", loggedIn, async (req, res) => {
//   res.send("Welcome to Dashboard page");
// });

app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});
