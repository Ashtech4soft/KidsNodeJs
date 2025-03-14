const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be a positive number']
    },
    razorpayPaymentId: {
      type: String,
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'pending'
    },
    paidTo: {
      type: String,
      required: true
    },
    // paidToId: { 
    //   type: mongoose.Schema.Types.ObjectId, 
    //   required: true 
    // }
  },
  {
    collection: 'payments'
  }
);

module.exports = mongoose.model('Payment', PaymentSchema);
