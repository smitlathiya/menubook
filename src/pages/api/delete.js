import connectDB from '../../lib/db';
import Product from '../../models/Product.JS';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { productId } = req.body;

      // Check if productId is provided
      if (!productId) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
      }

      // Find the product by ID and delete it
      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.status(200).json({ success: true, data: deletedProduct });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ success: false, error: 'Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}