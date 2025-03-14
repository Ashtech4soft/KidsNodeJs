const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      default: 'pending' 
    }
  },
  {
    collection: 'orders'
  }
);

module.exports = mongoose.model('Order', OrderSchema);
