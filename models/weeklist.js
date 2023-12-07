const mongoose = require("mongoose");

const WeekListSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },

  checked: {
    type: Boolean,
    required: true,
  },
});

module.exports = new mongoose.model("weeklist", WeekListSchema);
