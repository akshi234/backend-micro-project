const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const WeekListSchema = new mongoose.Schema({
  tasks: [TaskSchema],
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "completed"],
  },
});

module.exports = mongoose.model("WeekList", WeekListSchema);
