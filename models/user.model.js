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
  admin: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("users", userSchema);
