const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      // required: true
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      // required: true
    },
    productImage: {
      type: String, // Store file path as a string
      default: 'default-product.jpg'
    },
  },
  {
    collection: 'products', // Specifies the collection name in MongoDB
  }
);

// Export the correct model name
module.exports = mongoose.model('Product', ProductSchema);
