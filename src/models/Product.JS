// Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  size: String,
  image: {
    data: Buffer,
    contentType: String
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product =  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
