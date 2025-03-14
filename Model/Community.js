const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// community Schema
const CommunitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String, // Store file path as a string
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    collection: 'community', // Specifies the collection name in MongoDB
  }
);

// Export the correct model name
module.exports = mongoose.model('Community', CommunitySchema);
