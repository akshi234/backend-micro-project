const mongoose = require("mongoose");

const User = mongoose.model("User", {
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
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

module.exports = mongoose.model("user", User);
