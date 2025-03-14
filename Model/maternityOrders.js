const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MetrnityProducts',
            required: true
        },
        size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L'],
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

);

module.exports = mongoose.model('maternityOrderItem', OrderItemSchema);
