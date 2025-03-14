const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Employee schema with file field
let Employee = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    file: {
      type: String, // Store file path as a string
    },
  },
  {
    collection: 'employees',
  }
);

module.exports = mongoose.model('Employee', Employee);
