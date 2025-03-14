const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: [1, 'Rating must be at least 1'], 
      max: [5, 'Rating cannot exceed 5'] 
    },
    review: { 
      type: String, 
      required: true, 
      trim: true 
    },
    date: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    collection: 'reviews'
  }
);

module.exports = mongoose.model('Review', ReviewSchema);
