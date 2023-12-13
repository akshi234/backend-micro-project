const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const weeklistRouter = require("./routes/weeklist");
const authenticate = require("./middleware/authentication");
dotenv.config();

//EXPRESS APP
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/weeklist", weeklistRouter);
app.get("/page", authenticate, (req, res) => {
  res.json({
    status: "active",
    message: "running",
  });
});

//health API
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "Weeklist Server",
    time: new Date(),
    status: "active",
  });
});

app.listen(process.env.PORT || 3000, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() =>
      console.log(`Server is running on http://localhost:${process.env.PORT}`)
    )
    .catch((error) => console.log(error));
});
