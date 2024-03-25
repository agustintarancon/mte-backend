const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  document: {
    type: Number,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  
  salary: {
    type: Number,
    default: 0,
  },
  faults: {
    type: Number,
    default: 0,
  },
  halfFaults: {
    type: Number,
    default: 0
  },
  warnings: {
    type: Number,
    default: 0,
  },
  attendances: [{
    type: Schema.Types.ObjectId,
    ref: "attendances"
  }],

  attendance: {
    type: Schema.Types.ObjectId,
    ref: "attendances"
  }
});

module.exports = model("users", userSchema);
