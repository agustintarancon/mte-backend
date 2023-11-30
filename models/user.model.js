const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: {
    type: String,
  },
  document: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    default: 0
  },
  faults: {
    type: Number,
    default: 0
  },
  warnings: {
    type: Number,
    default: 0
  },
});

module.exports = model("users", userSchema);
