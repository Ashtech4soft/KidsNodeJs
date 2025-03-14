const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// supplier Schema
const SupplierSchema = new Schema(
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
      type: String, // Changed from Number to String to prevent losing leading zeros
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      // required: true,
      default: ''
    }

  },
  {
    collection: 'supplier', // Specifies the collection name in MongoDB
  }
);

// Export the correct model name
module.exports = mongoose.model('supplier', SupplierSchema);
