const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharityRequestSchema = new Schema(
  {
    charityItemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'CharityItem', 
      required: true 
    },
    requestReason: { 
      type: String, 
      required: true, 
      trim: true 
    },
    status: { 
      type: String, 
      default: 'Pending' 
    }
  },
  {
    collection: 'charity_requests'
  }
);

module.exports = mongoose.model('CharityRequest', CharityRequestSchema);
