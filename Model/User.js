const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
let User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    file: {
      type: String, // Store file path as a string
    },
  },
  {
    collection: 'users',
  }
);

module.exports = mongoose.model('User', User);
