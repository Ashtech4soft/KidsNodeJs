const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Charity Schema
const CharitySchema = new Schema(
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
      default: '',
    },
    charity: {
      type: Schema.Types.ObjectId,
      ref: 'Charity'
    }
  },
  {
    collection: 'charity', // Specifies the collection name in MongoDB
  }
);

// Export the correct model name
module.exports = mongoose.model('Charity', CharitySchema);
