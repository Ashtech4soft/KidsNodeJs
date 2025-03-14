const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// category Schema
const CategorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    collection: 'category', // Specifies the collection name in MongoDB
  }
);

// Export the correct model name
module.exports = mongoose.model('Category', CategorySchema);
