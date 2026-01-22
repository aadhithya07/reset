// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null }, // This stores the random string
  resetTokenExpiration: { type: Date, default: null }, // Optional: for security
});

module.exports = mongoose.model("User", UserSchema);