const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  parentEmail: String,
  parentMobile: String
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
