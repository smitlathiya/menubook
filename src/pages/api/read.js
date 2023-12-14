import connectDB from '../../lib/db';
import Product from '../../models/Product.JS';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await Product.find();
      
      products.forEach((data, index) => {
        if(data.image.data) {
          const str = Buffer.from(data.image.data, 'base64').toString('base64');
          products[index].image.data = `data:${data.image.contentType};base64,${str}`
        }
      });
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
