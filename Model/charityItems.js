const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharityItemSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    condition: {
      type: String,
      required: true
    },
    image: {
      type: String // Store image path or URL 
    },
    status: {
      type: String,
      default: 'Pending'
    }
  },
  {
    collection: 'charity_items'
  }
);

module.exports = mongoose.model('CharityItem', CharityItemSchema);
