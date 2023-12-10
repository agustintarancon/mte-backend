const { Schema, model } = require("mongoose");

const assistSchema = new Schema({
  fechaHora: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users', // Hace referencia al modelo de usuarios
    required: true,
  },
  present: {
    type: Boolean,
    default: true
  }
});

module.exports = model("attendances", assistSchema);
