const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    orderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Order', 
      required: true 
    },
    itemId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']  // add more statuses as needed
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orderQty: { 
      type: Number, 
      required: true, 
      min: [1, 'Order quantity must be at least 1'] 
    },
    price: { 
      type: Number, 
      required: true, 
    }
  },  
  {
    collection: 'order_items'
  }
);

module.exports = mongoose.model('OrderItem', OrderItemSchema);
