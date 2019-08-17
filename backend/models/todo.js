const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  todo: { type: String, required: true },
  status: { type: String, required: true},
  subtodo: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Todo", todoSchema);
